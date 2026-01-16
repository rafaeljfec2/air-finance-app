import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { ChevronLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountCategoryTypeFields } from './components/AccountCategoryTypeFields';
import { DescriptionField } from './components/DescriptionField';
import { NoteField } from './components/NoteField';
import { TransactionDetailsFields } from './components/TransactionDetailsFields';
import { TransactionTypeSelector } from './components/TransactionTypeSelector';
import { useTransactionData } from './hooks/useTransactionData';
import { useTransactionForm } from './hooks/useTransactionForm';

export function NewTransaction() {
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

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
  } = useTransactionForm();

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

  // Exibir loading enquanto carrega contas ou categorias
  if (loading) {
    return <Loading size="large">Carregando dados...</Loading>;
  }
  if (loadError) {
    return <div className="text-red-500 text-center py-8">{loadError}</div>;
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark p-3 md:p-4">
        <div className="mx-auto max-w-2xl">
          {/* Header Simples - Compacto */}
          <div className="flex items-center mb-3">
            <button
              onClick={() => navigate('/transactions')}
              className="mr-3 p-1.5 hover:bg-card dark:hover:bg-card-dark rounded-full transition-colors border border-transparent hover:border-border dark:hover:border-border-dark"
              aria-label="Voltar para transações"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                Nova Transação
              </h1>
            </div>
          </div>

          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark shadow-sm rounded-xl overflow-hidden">
            <form
              id="transaction-form"
              onSubmit={handleSubmit}
              className="divide-y divide-border dark:divide-border-dark"
            >
              <TransactionTypeSelector
                transactionType={transactionType}
                onTypeChange={handleTypeChange}
              />

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

              {/* Submit Button */}
              <div className="p-4 bg-background/50 dark:bg-background-dark/50 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/transactions')}
                  className="flex-1 h-10"
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "flex-[2] h-10 text-white font-medium shadow-sm transition-all",
                    transactionType === 'EXPENSE'
                      ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                      : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  )}
                  disabled={isCreating}
                >
                  {isCreating ? 'Salvando...' : `Salvar ${transactionType === 'EXPENSE' ? 'Despesa' : 'Receita'}`}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
