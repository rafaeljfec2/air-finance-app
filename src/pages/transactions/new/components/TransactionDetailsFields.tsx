import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
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

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
] as const;

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
      <div className="p-3 sm:p-4 bg-background dark:bg-background-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Valor */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Valor <span className="text-red-500">*</span>
            </label>
            <Input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              value={formatCurrency(amount)}
              onChange={onAmountChange}
              placeholder="R$ 0,00"
              required
              aria-required="true"
              aria-invalid={errors.amount ? 'true' : 'false'}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={cn(
                'bg-card dark:bg-card-dark text-text dark:text-text-dark border placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full',
                errors.amount
                  ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
                  : 'border-border dark:border-border-dark',
              )}
              autoComplete="off"
            />
            {errors.amount && (
              <span id="amount-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.amount}
              </span>
            )}
          </div>

          {/* Parcelas */}
          <div>
            <label
              htmlFor="installmentCount"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Quantidade de parcelas
            </label>
            <Select value={String(installmentCount)} onValueChange={onInstallmentCountChange}>
              <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                <div className="px-3 py-2">{installmentCount}x</div>
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <SelectItem
                    key={num}
                    value={String(num)}
                    className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                  >
                    {num}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {installmentCount > 1 && amount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                R$ {formatCurrency(installmentValue)} por parcela
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Para outras contas: mostrar campos baseados em variável ou recorrente
  return (
    <div className="p-3 sm:p-4 bg-background dark:bg-background-dark">
      {isRecurring ? (
        // Campos para transação recorrente
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Data inicial */}
          <div className="flex flex-col">
            <label
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Data inicial <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={recurrenceStartDate}
              onChange={onRecurrenceStartDateChange}
              placeholder="Selecionar data inicial"
              error={errors.recurrenceStartDate}
              minDate={new Date(1970, 0, 1)}
              maxDate={new Date(2100, 11, 31)}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </div>

          {/* Data final */}
          <div className="flex flex-col">
            <label
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Data final <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={recurrenceEndDate}
              onChange={onRecurrenceEndDateChange}
              placeholder="Selecionar data final"
              error={errors.recurrenceEndDate}
              minDate={recurrenceStartDate ? new Date(recurrenceStartDate) : new Date(1970, 0, 1)}
              maxDate={new Date(2100, 11, 31)}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </div>

          {/* Frequência */}
          <div className="flex flex-col">
            <label
              htmlFor="recurrenceFrequency"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Frequência <span className="text-red-500">*</span>
            </label>
            <Select
              value={recurrenceFrequency ?? 'monthly'}
              onValueChange={(value) => {
                const frequency = value as RecurrenceFrequency;
                onRecurrenceFrequencyChange?.(frequency);
              }}
            >
              <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                <div className="px-3 py-2">
                  {FREQUENCY_OPTIONS.find((opt) => opt.value === (recurrenceFrequency ?? 'monthly'))
                    ?.label ?? 'Mensal'}
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recurrenceFrequency && (
              <span className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.recurrenceFrequency}
              </span>
            )}
          </div>

          {/* Valor */}
          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Valor <span className="text-red-500">*</span>
            </label>
            <Input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              value={formatCurrency(amount)}
              onChange={onAmountChange}
              placeholder="R$ 0,00"
              required
              aria-required="true"
              aria-invalid={errors.amount ? 'true' : 'false'}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={cn(
                'bg-card dark:bg-card-dark text-text dark:text-text-dark border placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full',
                errors.amount
                  ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
                  : 'border-border dark:border-border-dark',
              )}
              autoComplete="off"
            />
            {errors.amount && (
              <span id="amount-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.amount}
              </span>
            )}
          </div>
        </div>
      ) : (
        // Campos para transação variável
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Data */}
          <div className="flex flex-col">
            <label
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Data de pagamento <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={date}
              onChange={onDateChange}
              placeholder="Selecionar data de pagamento"
              error={errors.date}
              minDate={new Date(1970, 0, 1)}
              maxDate={new Date(2100, 11, 31)}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </div>

          {/* Valor */}
          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Valor <span className="text-red-500">*</span>
            </label>
            <Input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              value={formatCurrency(amount)}
              onChange={onAmountChange}
              placeholder="R$ 0,00"
              required
              aria-required="true"
              aria-invalid={errors.amount ? 'true' : 'false'}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={cn(
                'bg-card dark:bg-card-dark text-text dark:text-text-dark border placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full',
                errors.amount
                  ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
                  : 'border-border dark:border-border-dark',
              )}
              autoComplete="off"
            />
            {errors.amount && (
              <span id="amount-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.amount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
