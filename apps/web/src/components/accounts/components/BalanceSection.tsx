import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Account, CreateAccount } from '@/services/accountService';
import { DollarSign } from 'lucide-react';
import { formatCurrencyInput } from '@/utils/formatters';

interface BalanceSectionProps {
  form: CreateAccount;
  errors: Record<string, string>;
  isCreditCard: boolean;
  account?: Account | null;
  initialBalanceInput: string;
  limitInput: string;
  onInitialBalanceChange: (value: string) => void;
  onLimitInputChange: (value: string) => void;
  onCreditLimitChange: (value: string, inputElement: HTMLInputElement) => void;
  onDateChange: (date: Date | undefined, fieldName: string) => void;
  onSwitchChange: (field: 'useInitialBalanceInExtract' | 'useInitialBalanceInCashFlow', checked: boolean) => void;
}

export function BalanceSection({
  form,
  errors,
  isCreditCard,
  account,
  initialBalanceInput,
  limitInput,
  onInitialBalanceChange,
  onLimitInputChange,
  onCreditLimitChange,
  onDateChange,
  onSwitchChange,
}: Readonly<BalanceSectionProps>) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 mb-1">
        <DollarSign className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />
        <h3 className="text-xs font-semibold text-text dark:text-text-dark uppercase tracking-wide">
          {isCreditCard ? 'Limite e Saldo' : 'Saldo Inicial'}
        </h3>
      </div>

      {isCreditCard ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <FormField label="Saldo Inicial *" error={errors.initialBalance}>
            <div className="relative">
              <Input
                name="limit"
                type="text"
                inputMode="decimal"
                value={limitInput}
                onChange={(e) => onLimitInputChange(e.target.value)}
                placeholder="R$ 0,00"
                required
                className={cn(
                  'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                  errors.initialBalance && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
          </FormField>

          <FormField label="Data do saldo inicial *" error={errors.initialBalanceDate}>
            <DatePicker
              value={form.initialBalanceDate || undefined}
              onChange={(date) => onDateChange(date, 'initialBalanceDate')}
              placeholder="Selecionar data"
              error={errors.initialBalanceDate}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </FormField>

          <FormField
            label="Limite do Cartão"
            error={errors.creditLimit ? String(errors.creditLimit) : undefined}
          >
            <div className="relative">
              <Input
                name="creditLimit"
                type="text"
                inputMode="decimal"
                defaultValue={
                  account?.creditLimit
                    ? formatCurrencyInput(account.creditLimit.toFixed(2).replace('.', ''))
                    : ''
                }
                onChange={(e) => onCreditLimitChange(e.target.value, e.target)}
                placeholder="R$ 0,00"
                className={cn(
                  'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                  errors.creditLimit && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
          </FormField>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <FormField label="Valor do saldo inicial *" error={errors.initialBalance}>
              <div className="relative">
                <Input
                  name="initialBalance"
                  type="text"
                  inputMode="decimal"
                  value={initialBalanceInput}
                  onChange={(e) => onInitialBalanceChange(e.target.value)}
                  placeholder="R$ 0,00"
                  required
                  className={cn(
                    'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                    errors.initialBalance && 'border-red-500 focus-visible:ring-red-500',
                  )}
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </div>
            </FormField>

            <FormField label="Data do saldo inicial *" error={errors.initialBalanceDate}>
              <DatePicker
                value={form.initialBalanceDate || undefined}
                onChange={(date) => onDateChange(date, 'initialBalanceDate')}
                placeholder="Selecionar data do saldo inicial"
                error={errors.initialBalanceDate}
                className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <FormField label="Usar saldo inicial no extrato">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.useInitialBalanceInExtract ?? true}
                  onCheckedChange={(checked) => onSwitchChange('useInitialBalanceInExtract', checked)}
                />
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  {(form.useInitialBalanceInExtract ?? true) ? 'Sim' : 'Não'}
                </span>
              </div>
            </FormField>

            <FormField label="Usar saldo inicial no fluxo de caixa">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.useInitialBalanceInCashFlow ?? true}
                  onCheckedChange={(checked) =>
                    onSwitchChange('useInitialBalanceInCashFlow', checked)
                  }
                />
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  {(form.useInitialBalanceInCashFlow ?? true) ? 'Sim' : 'Não'}
                </span>
              </div>
            </FormField>
          </div>
        </>
      )}
    </div>
  );
}
