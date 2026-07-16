import { useMemo } from 'react';

import { FormSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';

import { useTransactionData } from '../hooks/useTransactionData';
import { useTransactionForm } from '../hooks/useTransactionForm';

import { AccountCategoryTypeFields } from './AccountCategoryTypeFields';
import { DescriptionField } from './DescriptionField';
import { NoteField } from './NoteField';
import { TransactionDetailsFields } from './TransactionDetailsFields';
import { TransactionTypeSelector } from './TransactionTypeSelector';

interface NewTransactionFormProps {
  readonly onCancel: () => void;
  readonly onSuccess?: () => void;
  readonly persistDraft?: boolean;
}

export function NewTransactionForm({
  onCancel,
  onSuccess,
  persistDraft,
}: Readonly<NewTransactionFormProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const { accounts, categories, loading, loadError } = useTransactionData(companyId);
  const {
    transactionType,
    formData,
    errors,
    isCreating,
    handleChange,
    handleDateChange,
    handleSelectChange,
    handleTypeChange,
    handleSubmit,
  } = useTransactionForm({ onSuccess, persistDraft });

  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.id === formData.accountId),
    [accounts, formData.accountId],
  );

  const filteredCategories = useMemo(
    () =>
      Array.isArray(categories)
        ? categories.filter(
            (category) =>
              typeof category.type === 'string' && category.type.toUpperCase() === transactionType,
          )
        : [],
    [categories, transactionType],
  );

  if (loading) {
    return <FormSkeleton title="Nova Transação" />;
  }
  if (loadError) {
    return <div className="text-red-500 text-center py-8">{loadError}</div>;
  }

  return (
    <form
      id="transaction-form"
      onSubmit={handleSubmit}
      className="divide-y divide-border dark:divide-border-dark"
    >
      <TransactionTypeSelector transactionType={transactionType} onTypeChange={handleTypeChange} />

      <div className="divide-y divide-border dark:divide-border-dark">
        <DescriptionField
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />

        <AccountCategoryTypeFields
          accounts={accounts}
          categories={filteredCategories}
          accountId={formData.accountId}
          categoryId={formData.categoryId}
          transactionKind={formData.transactionKind}
          errors={errors}
          onAccountChange={(value) => handleSelectChange('accountId', value)}
          onCategoryChange={(value) => handleSelectChange('categoryId', value)}
          onTransactionKindChange={(kind) => handleSelectChange('transactionKind', kind)}
        />

        <TransactionDetailsFields
          selectedAccount={selectedAccount}
          transactionKind={formData.transactionKind}
          date={formData.date ?? ''}
          amount={formData.amount ?? 0}
          installmentCount={formData.installmentCount ?? 1}
          recurrenceStartDate={formData.recurrenceStartDate}
          recurrenceEndDate={formData.recurrenceEndDate}
          recurrenceFrequency={formData.recurrenceFrequency}
          errors={errors}
          onDateChange={handleDateChange}
          onAmountChange={handleChange}
          onInstallmentCountChange={(value) =>
            handleSelectChange('installmentCount', Number(value))
          }
          onRecurrenceStartDateChange={(date) => {
            const dateString = date ? formatDateToLocalISO(date) : '';
            handleSelectChange('recurrenceStartDate', dateString);
          }}
          onRecurrenceEndDateChange={(date) => {
            const dateString = date ? formatDateToLocalISO(date) : '';
            handleSelectChange('recurrenceEndDate', dateString);
          }}
          onRecurrenceFrequencyChange={(frequency) =>
            handleSelectChange('recurrenceFrequency', frequency)
          }
        />

        <NoteField value={formData.note ?? ''} onChange={handleChange} />
      </div>

      <div className="p-4 bg-background/50 dark:bg-background-dark/50 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-10"
          disabled={isCreating}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className={cn(
            'flex-[2] h-10 text-white font-medium shadow-sm transition-all',
            transactionType === 'EXPENSE'
              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500'
              : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500',
          )}
          disabled={isCreating}
        >
          {isCreating
            ? 'Salvando...'
            : `Salvar ${transactionType === 'EXPENSE' ? 'Despesa' : 'Receita'}`}
        </Button>
      </div>
    </form>
  );
}
