import { ComboBox } from '@/components/ui/ComboBox';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import { formatCurrency } from '@/utils/formatters';
import React, { useMemo } from 'react';

type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
type TransactionKind = 'FIXED' | 'VARIABLE';
type DateValue = string | Date | null | undefined;

interface TransactionDetailsFieldsProps {
  selectedAccount: Account | undefined;
  transactionKind: TransactionKind;
  date: DateValue;
  amount: number;
  installmentCount: number;
  // Campos de recorrência
  recurrenceStartDate?: DateValue;
  recurrenceEndDate?: DateValue;
  recurrenceFrequency?: RecurrenceFrequency;
  errors: Record<string, string>;
  onDateChange: (date: Date | undefined) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInstallmentCountChange: (value: string) => void;
  onRecurrenceStartDateChange?: (date: Date | undefined) => void;
  onRecurrenceEndDateChange?: (date: Date | undefined) => void;
  onRecurrenceFrequencyChange?: (frequency: RecurrenceFrequency) => void;
}

// Opções de frequência para transações recorrentes
const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
];

// Opções de parcelamento (1x a 18x)
const INSTALLMENT_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const value = i + 1;
  return {
    value: String(value),
    label: value === 1 ? 'À vista (1x)' : `${value}x`,
  };
});

export function TransactionDetailsFields({
  selectedAccount,
  transactionKind,
  date,
  amount,
  installmentCount,
  recurrenceStartDate,
  recurrenceEndDate,
  recurrenceFrequency,
  errors,
  onDateChange,
  onAmountChange,
  onInstallmentCountChange,
  onRecurrenceStartDateChange,
  onRecurrenceEndDateChange,
  onRecurrenceFrequencyChange,
}: Readonly<TransactionDetailsFieldsProps>) {
  const isCreditCard = selectedAccount?.type === 'credit_card';
  const isRecurring = !isCreditCard && transactionKind === 'FIXED';

  const installmentValue = useMemo(() => {
    if (installmentCount > 1 && amount > 0) {
      return amount / installmentCount;
    }
    return amount;
  }, [amount, installmentCount]);

  // Para cartão de crédito: mostrar apenas valor e parcelas
  if (isCreditCard) {
    return (
      <div className="p-3 bg-background dark:bg-background-dark">
        <div className="flex flex-col gap-3">
          {/* Valor Prominente */}
          <div>
            <label
              htmlFor="amount"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
            >
              Valor da Despesa <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-medium">
                R$
              </span>
              <Input
                id="amount"
                name="amount"
                type="text"
                inputMode="decimal"
                value={formatCurrency(amount)}
                onChange={onAmountChange}
                placeholder="0,00"
                required
                className={cn(
                  'pl-12 text-xl font-bold min-h-[44px] bg-background dark:bg-background-dark border-2 transition-all w-full rounded-lg',
                  errors.amount
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-border dark:border-border-dark focus-visible:border-primary-500 focus-visible:ring-primary-500',
                )}
                autoComplete="off"
              />
            </div>
            {errors.amount && (
              <span className="text-xs text-red-500 mt-1 font-medium ml-1">{errors.amount}</span>
            )}
          </div>

          {/* Parcelas */}
          <div>
            <label
              htmlFor="installmentCount"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
            >
              Parcelamento
            </label>
            <ComboBox
              options={INSTALLMENT_OPTIONS}
              value={String(installmentCount)}
              onValueChange={(value) => onInstallmentCountChange(value ?? '1')}
              placeholder="Selecione..."
              searchable={false}
              className={cn(
                'w-full h-10 bg-card dark:bg-card-dark text-foreground border rounded-lg hover:bg-accent/50 transition-all text-sm',
                'border-border dark:border-border-dark hover:border-primary-400',
              )}
            />
            {installmentCount > 1 && amount > 0 && (
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium bg-primary-50 dark:bg-primary-900/10 p-2 rounded-lg border border-primary-100 dark:border-primary-900/20">
                {installmentCount}x de R$ {formatCurrency(installmentValue)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Para outras contas: mostrar campos baseados em variável ou recorrente
  return (
    <div className="p-3 bg-background dark:bg-background-dark">
      {isRecurring ? (
        // Campos para transação recorrente
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Valor - Prominente para Recorrente também */}
            <div className="sm:col-span-2">
              <label
                htmlFor="amount"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
              >
                Valor da Parcela <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-medium">
                  R$
                </span>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  value={formatCurrency(amount)}
                  onChange={onAmountChange}
                  placeholder="0,00"
                  required
                  className={cn(
                    'pl-12 text-xl font-bold min-h-[44px] bg-background dark:bg-background-dark border-2 transition-all w-full rounded-lg',
                    errors.amount
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-border dark:border-border-dark focus-visible:border-primary-500 focus-visible:ring-primary-500',
                  )}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Data inicial */}
            <div className="flex flex-col">
              <label
                htmlFor="recurrenceStartDate"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
              >
                Começa em <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={recurrenceStartDate}
                onChange={onRecurrenceStartDateChange}
                placeholder="Selecionar data inicial"
                error={errors.recurrenceStartDate}
                minDate={new Date(1970, 0, 1)}
                maxDate={new Date(2100, 11, 31)}
                className="h-9 w-full bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-lg"
              />
            </div>

            {/* Frequência */}
            <div className="flex flex-col">
              <label
                htmlFor="recurrenceFrequency"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
              >
                Repete a cada <span className="text-red-500">*</span>
              </label>
              <ComboBox
                options={[...FREQUENCY_OPTIONS]}
                value={recurrenceFrequency ?? 'monthly'}
                onValueChange={(value) => {
                  const frequency = value as RecurrenceFrequency;
                  onRecurrenceFrequencyChange?.(frequency);
                }}
                placeholder="Selecione..."
                searchable={false}
                className={cn(
                  'w-full h-9 bg-card dark:bg-card-dark text-foreground border rounded-lg hover:bg-accent/50 transition-all text-sm',
                  'border-border dark:border-border-dark hover:border-primary-400',
                )}
              />
            </div>

            {/* Data final (Opcional) */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="recurrenceEndDate"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
              >
                Termina em <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={recurrenceEndDate}
                onChange={onRecurrenceEndDateChange}
                placeholder="Selecionar data final"
                error={errors.recurrenceEndDate}
                minDate={recurrenceStartDate ? new Date(recurrenceStartDate) : new Date(1970, 0, 1)}
                maxDate={new Date(2100, 11, 31)}
                className="h-9 w-full bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        // Campos para transação variável (Padrão)
        <div className="flex flex-col gap-3">
          {/* Valor Prominente */}
          <div>
            <label
              htmlFor="amount"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
            >
              Valor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-medium">
                R$
              </span>
              <Input
                id="amount"
                name="amount"
                type="text"
                inputMode="decimal"
                value={formatCurrency(amount)}
                onChange={onAmountChange}
                placeholder="0,00"
                required
                className={cn(
                  'pl-12 text-xl font-bold min-h-[44px] bg-background dark:bg-background-dark border-2 transition-all w-full rounded-lg',
                  errors.amount
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-border dark:border-border-dark focus-visible:border-primary-500 focus-visible:ring-primary-500',
                )}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Data */}
          <div>
            <label
              htmlFor="date"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
            >
              Data de pagamento <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={date}
              onChange={onDateChange}
              placeholder="Selecionar data"
              error={errors.date}
              minDate={new Date(1970, 0, 1)}
              maxDate={new Date(2100, 11, 31)}
              className="min-h-[44px] w-full bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-lg hover:bg-background/80"
            />
          </div>
        </div>
      )}
    </div>
  );
}
