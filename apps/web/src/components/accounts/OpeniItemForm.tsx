import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { type OpeniConnector } from '@/services/openiService';

interface OpeniItemFormProps {
  connector: OpeniConnector;
  parameters: Record<string, string>;
  isLoading: boolean;
  onParameterChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export function OpeniItemForm({
  connector,
  parameters,
  isLoading,
  onParameterChange,
  onSubmit,
}: Readonly<OpeniItemFormProps>) {
  const requiredFields = connector.rules.filter((rule) => rule.required);
  const optionalFields = connector.rules.filter((rule) => !rule.required);

  const validateField = (value: string, rule: (typeof connector.rules)[0]): string | null => {
    if (rule.required && (!value || value.trim() === '')) {
      return `${rule.label} é obrigatório`;
    }

    if (value && rule.validation?.regex) {
      const regex = new RegExp(rule.validation.regex);
      if (!regex.test(value)) {
        return rule.validation.errorMessage ?? `${rule.label} é inválido`;
      }
    }

    return null;
  };

  const getFieldError = (field: string): string | null => {
    const rule = connector.rules.find((r) => r.field === field);
    if (!rule) return null;
    return validateField(parameters[field] ?? '', rule);
  };

  const hasErrors = connector.rules.some((rule) => {
    const error = getFieldError(rule.field);
    return error !== null;
  });

  const allRequiredFieldsFilled = requiredFields.every(
    (rule) => parameters[rule.field] && parameters[rule.field].trim() !== '',
  );

  const canSubmit = allRequiredFieldsFilled && !hasErrors && !isLoading;

  const renderField = (rule: (typeof connector.rules)[0]) => {
    const value = parameters[rule.field] ?? '';
    const error = getFieldError(rule.field);
    const fieldId = `openi-${connector.id}-${rule.field}`;

    return (
      <div key={rule.field} className="space-y-2">
        <Label htmlFor={fieldId} className="text-sm">
          {rule.label}
          {rule.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {rule.type === 'password' ? (
          <Input
            id={fieldId}
            type="password"
            value={value}
            onChange={(e) => onParameterChange(rule.field, e.target.value)}
            placeholder={rule.label}
            className={error ? 'border-red-500' : ''}
            disabled={isLoading}
          />
        ) : (
          <Input
            id={fieldId}
            type={rule.type === 'email' ? 'email' : rule.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => onParameterChange(rule.field, e.target.value)}
            placeholder={rule.label}
            className={error ? 'border-red-500' : ''}
            disabled={isLoading}
          />
        )}
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Conectando com {connector.name}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Preencha os dados solicitados para conectar sua conta via Open Finance
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) {
            onSubmit();
          }
        }}
        className="space-y-4"
      >
        {requiredFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text dark:text-text-dark">
              Campos obrigatórios
            </h3>
            {requiredFields.map(renderField)}
          </div>
        )}

        {optionalFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text dark:text-text-dark">
              Campos opcionais
            </h3>
            {optionalFields.map(renderField)}
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              'Conectar'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
