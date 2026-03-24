import { DollarSign, FileText, TrendingUp } from 'lucide-react';

import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { getCreditLimit } from '@/services/accountHelpers';
import type { Account, CreateAccount } from '@/services/accountService';
import { formatCurrencyInput } from '@/utils/formatters';

type BalanceContext = 'extract' | 'cashFlow';

interface BalanceSectionProps {
  readonly form: CreateAccount;
  readonly errors: Record<string, string>;
  readonly isCreditCard: boolean;
  readonly account?: Account | null;
  readonly extractBalanceInput: string;
  readonly cashFlowBalanceInput: string;
  readonly limitInput: string;
  readonly onLimitInputChange: (value: string) => void;
  readonly onCreditLimitChange: (value: string, inputElement: HTMLInputElement) => void;
  readonly onDateChange: (date: Date | undefined, fieldName: string) => void;
  readonly onContextBalanceChange: (context: BalanceContext, value: string) => void;
  readonly onContextDateChange: (context: BalanceContext, date: Date | undefined) => void;
  readonly onContextEnabledChange: (context: BalanceContext, checked: boolean) => void;
}

const inputClasses =
  'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10';

function ContextBalanceRow({
  label,
  icon: Icon,
  balanceInput,
  date,
  enabled,
  onBalanceChange,
  onDateChange,
  onEnabledChange,
}: {
  readonly label: string;
  readonly icon: typeof FileText;
  readonly balanceInput: string;
  readonly date: string | null | undefined;
  readonly enabled: boolean;
  readonly onBalanceChange: (value: string) => void;
  readonly onDateChange: (date: Date | undefined) => void;
  readonly onEnabledChange: (checked: boolean) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-border dark:border-border-dark p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />
          <span className="text-xs font-medium text-text dark:text-text-dark uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            {enabled ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      {enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField label="Valor">
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                value={balanceInput}
                onChange={(e) => onBalanceChange(e.target.value)}
                placeholder="R$ 0,00"
                className={cn(inputClasses)}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
          </FormField>

          <FormField label="Data">
            <DatePicker
              value={date ?? undefined}
              onChange={onDateChange}
              placeholder="Selecionar data"
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </FormField>
        </div>
      )}
    </div>
  );
}

export function BalanceSection({
  form,
  errors,
  isCreditCard,
  account,
  extractBalanceInput,
  cashFlowBalanceInput,
  limitInput,
  onLimitInputChange,
  onCreditLimitChange,
  onDateChange,
  onContextBalanceChange,
  onContextDateChange,
  onContextEnabledChange,
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
                  inputClasses,
                  errors.initialBalance && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
          </FormField>

          <FormField label="Data do saldo inicial *" error={errors.initialBalanceDate}>
            <DatePicker
              value={form.initialBalanceDate ?? undefined}
              onChange={(date) => onDateChange(date, 'initialBalanceDate')}
              placeholder="Selecionar data"
              error={errors.initialBalanceDate}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </FormField>

          <FormField
            label="Limite do Cartao"
            error={errors.creditLimit ? String(errors.creditLimit) : undefined}
          >
            <div className="relative">
              <Input
                name="creditLimit"
                type="text"
                inputMode="decimal"
                defaultValue={
                  account && getCreditLimit(account)
                    ? formatCurrencyInput(getCreditLimit(account)!.toFixed(2).replace('.', ''))
                    : ''
                }
                onChange={(e) => onCreditLimitChange(e.target.value, e.target)}
                placeholder="R$ 0,00"
                className={cn(
                  inputClasses,
                  errors.creditLimit && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
          </FormField>
        </div>
      ) : (
        <div className="space-y-2.5">
          <ContextBalanceRow
            label="Extrato"
            icon={FileText}
            balanceInput={extractBalanceInput}
            date={form.extractBalanceInput?.date}
            enabled={form.extractBalanceInput?.enabled ?? true}
            onBalanceChange={(v) => onContextBalanceChange('extract', v)}
            onDateChange={(d) => onContextDateChange('extract', d)}
            onEnabledChange={(c) => onContextEnabledChange('extract', c)}
          />

          <ContextBalanceRow
            label="Fluxo de Caixa"
            icon={TrendingUp}
            balanceInput={cashFlowBalanceInput}
            date={form.cashFlowBalanceInput?.date}
            enabled={form.cashFlowBalanceInput?.enabled ?? true}
            onBalanceChange={(v) => onContextBalanceChange('cashFlow', v)}
            onDateChange={(d) => onContextDateChange('cashFlow', d)}
            onEnabledChange={(c) => onContextEnabledChange('cashFlow', c)}
          />
        </div>
      )}
    </div>
  );
}
