import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, CheckCircle2, Eye, EyeOff, Save, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

import { ProfileIntegrationsSchema, type ProfileIntegrationsFormValues } from '../schemas';

import { ProfileSectionCard, SettingRow } from './ProfileSectionCard';

interface ProfileIntegrationsSectionProps {
  readonly integrations: ProfileIntegrationsFormValues;
  readonly isSaving: boolean;
  readonly onChange: (key: keyof ProfileIntegrationsFormValues, value: string | boolean) => void;
  readonly onSave: (values: ProfileIntegrationsFormValues) => void | Promise<void>;
}

const MODEL_OPTIONS = [
  {
    value: 'gpt-4o-mini' as const,
    label: 'GPT-4o Mini',
    description: 'Rápido e econômico — recomendado no dia a dia',
  },
  {
    value: 'gpt-4o' as const,
    label: 'GPT-4o',
    description: 'Mais preciso em análises complexas',
  },
  {
    value: 'gpt-4-turbo' as const,
    label: 'GPT-4 Turbo',
    description: 'Bom equilíbrio entre custo e qualidade',
  },
  {
    value: 'gpt-3.5-turbo' as const,
    label: 'GPT-3.5 Turbo',
    description: 'Legado — use só se necessário',
  },
];

export function ProfileIntegrationsSection({
  integrations,
  isSaving,
  onChange,
  onSave,
}: ProfileIntegrationsSectionProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const form = useForm<ProfileIntegrationsFormValues>({
    resolver: zodResolver(ProfileIntegrationsSchema),
    defaultValues: integrations,
  });

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset(integrations);
    }
  }, [integrations, form]);

  const isDirty = form.formState.isDirty;

  const handlePersist = form.handleSubmit(async (values) => {
    await onSave(values);
    form.reset({ ...values, openaiApiKey: '' });
  });

  return (
    <ProfileSectionCard
      title="Inteligência artificial"
      description="Conecte sua chave OpenAI para classificação e insights financeiros"
      icon={<Bot className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />}
      action={
        integrations.hasOpenaiKey ? (
          <Badge variant="success" className="gap-1 text-[11px]">
            <CheckCircle2 className="h-3 w-3" />
            Chave ativa
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-[11px]">
            Não configurada
          </Badge>
        )
      }
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            A chave fica criptografada no servidor e nunca é exibida novamente após salvar.
          </p>
          <Button
            type="button"
            disabled={isSaving || !isDirty}
            variant="success"
            className="min-h-[44px] gap-2 sm:min-w-[180px]"
            onClick={handlePersist}
          >
            {isSaving ? <Spinner size="sm" /> : <Save className="h-4 w-4" />}
            Salvar IA
          </Button>
        </div>
      }
    >
      <form className="space-y-6" onSubmit={handlePersist}>
        <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 dark:border-primary-400/20 dark:bg-primary-400/5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400" />
            <p className="text-sm text-muted-foreground">
              Sem uma chave OpenAI, recursos de classificação automática e agentes de IA ficam
              limitados. Você pode obter uma chave em{' '}
              <span className="font-medium text-text dark:text-text-dark">platform.openai.com</span>
              .
            </p>
          </div>
        </div>

        <SettingRow
          title="API Key"
          description={
            integrations.hasOpenaiKey
              ? 'Deixe em branco para manter a chave atual, ou cole uma nova para substituir'
              : 'Cole sua chave secreta começando com sk-'
          }
          htmlFor="openai-api-key"
          control={
            <div className="relative">
              <Input
                id="openai-api-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder={integrations.hasOpenaiKey ? '••••••••••••••••' : 'sk-...'}
                className="border-border bg-background pr-10 text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                {...form.register('openaiApiKey', {
                  onChange: (e) => onChange('openaiApiKey', e.target.value),
                })}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-text dark:hover:text-text-dark"
                aria-label={showApiKey ? 'Ocultar chave' : 'Mostrar chave'}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          }
        />

        <div>
          <p className="mb-3 text-sm font-medium text-text dark:text-text-dark">Modelo padrão</p>
          <Controller
            name="openaiModel"
            control={form.control}
            render={({ field }) => (
              <div
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                role="radiogroup"
                aria-label="Modelo OpenAI"
              >
                {MODEL_OPTIONS.map((option) => {
                  const selected = field.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        field.onChange(option.value);
                        onChange('openaiModel', option.value);
                      }}
                      className={cn(
                        'rounded-xl border p-3.5 text-left transition-colors',
                        selected
                          ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30 dark:border-primary-400'
                          : 'border-border bg-background hover:border-primary-500/40 dark:border-border-dark dark:bg-background-dark',
                      )}
                    >
                      <p className="text-sm font-semibold text-text dark:text-text-dark">
                        {option.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </form>
    </ProfileSectionCard>
  );
}
