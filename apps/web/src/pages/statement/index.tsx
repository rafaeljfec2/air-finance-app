import { StatementFilters } from '@/components/statement/StatementFilters';
import {
    TransactionGrid,
    type TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import { Card } from '@/components/ui/card';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { useStatementStore } from '@/stores/statement';
import { formatCurrency } from '@/utils/formatters';
import {
    AlertTriangle,
    ChevronDown,
    FileText,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function Statement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const {
    transactions,
    categories,
    availableBalance,
    income,
    expenses,
    previousBalance,
    previousIncome,
    previousExpenses,
    isLoading,
    error,
    errorDetails,
    loadTransactions,
  } = useStatementStore();

  // Configurar pull-to-refresh
  const { containerProps } = usePullToRefresh({
    onRefresh: () => {
      void loadTransactions();
    },
  });

  // Filtrar transações
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchTerm
      ? transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = selectedCategory ? transaction.category.id === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const transactionsForGrid = useMemo<TransactionGridTransaction[]>(() => {
    let accumulatedBalance = 0;

    return filteredTransactions.map((transaction) => {
      const launchType: TransactionGridTransaction['launchType'] =
        transaction.type === 'INCOME' ? 'revenue' : 'expense';
      const value = transaction.amount;
      const credit = launchType === 'revenue' ? value : 0;
      const debit = launchType === 'expense' ? value : 0;
      accumulatedBalance += credit - debit;

      return {
        id: transaction.id,
        description: transaction.description,
        value,
        launchType,
        valueType: 'fixed',
        companyId: transaction.companyId,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        paymentDate: transaction.date,
        issueDate: transaction.date,
        quantityInstallments: transaction.installmentCount ?? 1,
        repeatMonthly:
          transaction.installmentCount !== undefined && transaction.installmentCount > 1,
        observation: transaction.note ?? undefined,
        reconciled: false,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        balance: accumulatedBalance,
      };
    });
  }, [filteredTransactions]);

  const handleEdit = (transaction: TransactionGridTransaction) => {
    console.log('Edit transaction:', transaction);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilterCategory = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  if (error) {
    return (
      <ViewDefault>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
          <div className="text-center max-w-md mx-auto p-4 sm:p-8">
            <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 dark:text-red-400 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              {error}
            </p>

            {/* Technical error details */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ChevronDown
                  className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 transition-transform ${showErrorDetails ? 'transform rotate-180' : ''}`}
                />
                Technical Details
              </button>

              {showErrorDetails && (
                <div className="mt-4 p-3 sm:p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                  <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {JSON.stringify(errorDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => loadTransactions()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                  Financial Statement
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View your detailed transaction history
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-text dark:text-text-dark">
                    Total Income
                  </h3>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-green-400">
                  {formatCurrency(income)}
                </p>
                {previousIncome > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Previous month: {formatCurrency(previousIncome)}
                  </p>
                )}
              </div>
            </Card>

            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-text dark:text-text-dark">
                    Total Expenses
                  </h3>
                  <TrendingDown className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-red-400">
                  {formatCurrency(expenses)}
                </p>
                {previousExpenses > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Previous month: {formatCurrency(previousExpenses)}
                  </p>
                )}
              </div>
            </Card>

            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-text dark:text-text-dark">
                    Available Balance
                  </h3>
                  <div
                    className={cn(
                      'h-5 w-5',
                      availableBalance >= 0 ? 'text-green-400' : 'text-red-400',
                    )}
                  >
                    {availableBalance >= 0 ? <TrendingUp /> : <TrendingDown />}
                  </div>
                </div>
                <p
                  className={cn(
                    'text-xl sm:text-2xl font-semibold',
                    availableBalance >= 0 ? 'text-green-400' : 'text-red-400',
                  )}
                >
                  {formatCurrency(availableBalance)}
                </p>
                {previousBalance !== 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Previous month: {formatCurrency(previousBalance)}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Filters */}
          <StatementFilters
            onSearch={handleSearch}
            onFilterCategory={handleFilterCategory}
            categories={categories}
            selectedCategory={selectedCategory}
          />

          {/* Transactions List */}
          <div {...containerProps}>
            <TransactionGrid
              transactions={transactionsForGrid}
              isLoading={isLoading}
              showActions={true}
              onActionClick={handleEdit}
              spacious={true}
              resetPageKey={`${searchTerm}-${selectedCategory}`}
            />
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
