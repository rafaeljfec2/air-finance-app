import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, DollarSign, Globe, Monitor, Moon, Palette, Save, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useTheme } from '@/stores/useTheme';

import { ProfilePreferencesSchema, type ProfilePreferencesFormValues } from '../schemas';

import { ProfileSectionCard, SettingRow } from './ProfileSectionCard';

interface ProfilePreferencesSectionProps {
  readonly preferences: ProfilePreferencesFormValues;
  readonly isSaving: boolean;
  readonly onChange: (key: keyof ProfilePreferencesFormValues, value: string) => void;
  readonly onSave: (values: ProfilePreferencesFormValues) => void | Promise<void>;
}

const LANGUAGE_LABELS: Record<string, string> = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'es-ES': 'Español',
};

const THEME_OPTIONS = [
  {
    value: 'light' as const,
    label: 'Claro',
    description: 'Fundo claro o tempo todo',
    icon: Sun,
  },
  {
    value: 'dark' as const,
    label: 'Escuro',
    description: 'Fundo escuro o tempo todo',
    icon: Moon,
  },
  {
    value: 'system' as const,
    label: 'Sistema',
    description: 'Segue o dispositivo',
    icon: Monitor,
  },
];

export function ProfilePreferencesSection({
  preferences,
  isSaving,
  onChange,
  onSave,
}: ProfilePreferencesSectionProps) {
  const { preference, setPreference } = useTheme();
  const form = useForm<ProfilePreferencesFormValues>({
    resolver: zodResolver(ProfilePreferencesSchema),
    defaultValues: preferences,
  });

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset(preferences);
    }
  }, [preferences, form]);

  useEffect(() => {
    form.setValue('theme', preference, {
      shouldDirty: preference !== preferences.theme,
    });
  }, [preference, preferences.theme, form]);

  const themeDirty = preference !== preferences.theme;
  const isDirty = form.formState.isDirty || themeDirty;

  const handlePersist = form.handleSubmit(async (values) => {
    const payload: ProfilePreferencesFormValues = {
      ...values,
      theme: preference,
    };
    await onSave(payload);
    form.reset(payload);
  });

  return (
    <ProfileSectionCard
      title="Aparência e região"
      description="Personalize como a plataforma se comporta para você"
      icon={<Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {isDirty
              ? 'Há alterações não salvas nesta seção (inclui tema do header).'
              : 'Tema aplica na hora; demais opções precisam ser salvas.'}
          </p>
          <Button
            type="button"
            disabled={isSaving || !isDirty}
            variant="success"
            className="min-h-[44px] gap-2 sm:min-w-[180px]"
            onClick={handlePersist}
          >
            {isSaving ? <Spinner size="sm" /> : <Save className="h-4 w-4" />}
            Salvar preferências
          </Button>
        </div>
      }
    >
      <form className="space-y-6" onSubmit={handlePersist}>
        <div>
          <p className="mb-3 text-sm font-medium text-text dark:text-text-dark">Tema</p>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Tema"
          >
            {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => {
              const selected = preference === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setPreference(value);
                    form.setValue('theme', value, { shouldDirty: true });
                    onChange('theme', value);
                  }}
                  className={cn(
                    'flex min-h-[88px] flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors',
                    selected
                      ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/40 dark:border-primary-400 dark:bg-primary-400/10'
                      : 'border-border bg-background hover:border-primary-500/40 dark:border-border-dark dark:bg-background-dark',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      selected ? 'text-primary-600 dark:text-primary-400' : 'text-muted-foreground',
                    )}
                  />
                  <div>
                    <p className="text-sm font-semibold text-text dark:text-text-dark">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="divide-y divide-border dark:divide-border-dark">
          <SettingRow
            title="Moeda padrão"
            description="Usada em relatórios, orçamentos e valores exibidos"
            htmlFor="currency-select"
            control={
              <Controller
                name="currency"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      onChange('currency', v);
                    }}
                  >
                    <SelectTrigger
                      id="currency-select"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                    >
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {field.value}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark">
                      <SelectItem value="BRL">BRL — Real brasileiro</SelectItem>
                      <SelectItem value="USD">USD — Dólar americano</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            }
          />

          <SettingRow
            title="Idioma"
            description="Idioma da interface quando disponível"
            htmlFor="language-select"
            control={
              <Controller
                name="language"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      onChange('language', v);
                    }}
                  >
                    <SelectTrigger
                      id="language-select"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {LANGUAGE_LABELS[field.value] ?? field.value}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark">
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            }
          />

          <SettingRow
            title="Formato de data"
            description="Como datas aparecem em listagens e gráficos"
            htmlFor="date-format-select"
            control={
              <Controller
                name="dateFormat"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      onChange('dateFormat', v);
                    }}
                  >
                    <SelectTrigger
                      id="date-format-select"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {field.value}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark">
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            }
          />
        </div>
      </form>
    </ProfileSectionCard>
  );
}
