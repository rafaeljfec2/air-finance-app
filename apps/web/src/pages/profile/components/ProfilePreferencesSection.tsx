import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, DollarSign, Globe, Palette, Save } from 'lucide-react';

interface PreferencesData {
  currency: string;
  language: string;
  theme: string;
  dateFormat: string;
}

interface ProfilePreferencesSectionProps {
  readonly preferences: PreferencesData;
  readonly isSaving: boolean;
  readonly onChange: (key: keyof PreferencesData, value: string) => void;
  readonly onSave: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
  'es-ES': 'Español',
};

const THEME_LABELS: Record<string, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};

export function ProfilePreferencesSection({
  preferences,
  isSaving,
  onChange,
  onSave,
}: ProfilePreferencesSectionProps) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="currency-select"
            className="flex items-center gap-2 text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            <DollarSign className="w-4 h-4 text-gray-500" /> Moeda Padrão
          </label>
          <Select value={preferences.currency} onValueChange={(v) => onChange('currency', v)}>
            <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              {preferences.currency}
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
              <SelectItem value="USD">USD - Dólar Americano</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="language-select"
            className="flex items-center gap-2 text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            <Globe className="w-4 h-4 text-gray-500" /> Idioma
          </label>
          <Select value={preferences.language} onValueChange={(v) => onChange('language', v)}>
            <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              {LANGUAGE_LABELS[preferences.language] ?? preferences.language}
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              <SelectItem value="pt-BR">Português</SelectItem>
              <SelectItem value="en-US">English</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="theme-select"
            className="flex items-center gap-2 text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            <Palette className="w-4 h-4 text-gray-500" /> Tema
          </label>
          <Select value={preferences.theme} onValueChange={(v) => onChange('theme', v)}>
            <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              {THEME_LABELS[preferences.theme] ?? preferences.theme}
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="date-format-select"
            className="flex items-center gap-2 text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            <Calendar className="w-4 h-4 text-gray-500" /> Formato de Data
          </label>
          <Select value={preferences.dateFormat} onValueChange={(v) => onChange('dateFormat', v)}>
            <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              {preferences.dateFormat}
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} disabled={isSaving} variant="success" className="gap-2">
            {isSaving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
            Salvar Preferências
          </Button>
        </div>
      </div>
    </Card>
  );
}
