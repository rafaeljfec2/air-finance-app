import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
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
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-background/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark">
          <div className="container mx-auto px-4">
            <div className="flex items-center py-4">
              <button
                onClick={() => navigate('/transactions')}
                className="p-2 hover:bg-card dark:hover:bg-card-dark rounded-lg transition-colors"
                aria-label="Voltar para transações"
              >
                <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
              </button>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-text dark:text-text-dark">
                  Novo lançamento
                </h1>
                <p className="text-sm text-text/60 dark:text-text-dark/60">
                  Preencha os dados da transação
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card className="bg-card dark:bg-card-dark border border-border dark:border-border-dark w-full sm:max-w-[60%] sm:mx-auto shadow-lg">
            <form
              id="transaction-form"
              onSubmit={handleSubmit}
              className="divide-y divide-border dark:divide-border-dark"
            >
              <TransactionTypeSelector
                transactionType={transactionType}
                onTypeChange={handleTypeChange}
              />

              <DescriptionField
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                autoFocus
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
                date={formData.date ?? ''}
                amount={formData.amount ?? 0}
                installmentCount={formData.installmentCount ?? 1}
                repeatMonthly={formData.repeatMonthly ?? false}
                errors={errors}
                onDateChange={handleDateChange}
                onAmountChange={handleChange}
                onInstallmentCountChange={(value) =>
                  handleSelectChange('installmentCount', Number(value))
                }
                onRepeatMonthlyChange={(checked) => handleSelectChange('repeatMonthly', checked)}
              />

              <NoteField value={formData.note ?? ''} onChange={handleChange} />

              {/* Submit Button */}
              <div className="p-4 sm:p-6 bg-background dark:bg-background-dark rounded-b-lg">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/transactions')}
                    className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-400 transition-colors shadow-md"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Salvando...' : 'Salvar Transação'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
