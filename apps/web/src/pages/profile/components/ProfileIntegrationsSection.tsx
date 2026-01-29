import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Bot, Eye, EyeOff, Save } from 'lucide-react';

type OpenaiModelType = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

interface IntegrationsData {
  openaiApiKey: string;
  openaiModel: OpenaiModelType;
  hasOpenaiKey: boolean;
}

interface ProfileIntegrationsSectionProps {
  readonly integrations: IntegrationsData;
  readonly isSaving: boolean;
  readonly onChange: (key: keyof IntegrationsData, value: string | boolean) => void;
  readonly onSave: () => void;
}

export function ProfileIntegrationsSection({
  integrations,
  isSaving,
  onChange,
  onSave,
}: ProfileIntegrationsSectionProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">
            OpenAI (Inteligência Artificial)
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Configure suas chaves de API para permitir que a IA analise suas finanças.
        </p>

        <div>
          <label
            htmlFor="openai-api-key"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
          >
            OpenAI API Key
            {integrations.hasOpenaiKey && (
              <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                (chave configurada)
              </span>
            )}
          </label>
          <div className="relative">
            <Input
              id="openai-api-key"
              type={showApiKey ? 'text' : 'password'}
              value={integrations.openaiApiKey}
              onChange={(e) => onChange('openaiApiKey', e.target.value)}
              placeholder={integrations.hasOpenaiKey ? '••••••••••••••••' : 'sk-...'}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="openai-model"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
          >
            Modelo Padrão
          </label>
          <Select
            value={integrations.openaiModel}
            onValueChange={(v) => onChange('openaiModel', v)}
          >
            <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              {integrations.openaiModel}
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recomendado)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o (Mais preciso)</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} disabled={isSaving} variant="success" className="gap-2">
            {isSaving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
            Salvar Integrações
          </Button>
        </div>
      </div>
    </Card>
  );
}
