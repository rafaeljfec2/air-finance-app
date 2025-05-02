import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';
import { StatementFilters } from '@/components/statement/StatementFilters';
import { useStatementStore } from '@/stores/statement';
import { Transaction } from '@/types/transaction';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { 
  ExclamationTriangleIcon, 
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { TransactionGrid } from '@/components/transactions/TransactionGrid';

export function Statement() {
  const navigate = useNavigate();
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
    removeTransaction,
  } = useStatementStore();

  // Configurar pull-to-refresh
  const { containerProps } = usePullToRefresh({
    onRefresh: loadTransactions,
  });

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm
      ? transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? transaction.category.id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // Calcular saldo acumulado para cada transação
  let accumulatedBalance = 0;
  const transactionsWithBalance = filteredTransactions.map(transaction => {
    const credit = transaction.type === 'INCOME' ? transaction.amount : 0;
    const debit = transaction.type === 'EXPENSE' ? transaction.amount : 0;
    accumulatedBalance += credit - debit;
    return {
      ...transaction,
      credit,
      debit,
      balance: accumulatedBalance,
      account: {
        id: transaction.accountId,
        name: 'Main Account' // TODO: Get from store
      },
      note: transaction.note || '',
      category: {
        ...transaction.category,
        type: transaction.type
      }
    };
  });

  const handleEdit = async (transaction: Transaction) => {
    // TODO: Implement edit modal
    console.log('Edit transaction:', transaction);
  };

  const handleRemove = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this transaction?')) {
      await removeTransaction(id);
    }
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
            <ExclamationTriangleIcon className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 dark:text-red-400 mx-auto mb-4 sm:mb-6" />
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
                <ChevronDownIcon 
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
                <DocumentTextIcon className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Financial Statement</h1>
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
                  <h3 className="text-sm font-medium text-text dark:text-text-dark">Total Income</h3>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
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
                  <h3 className="text-sm font-medium text-text dark:text-text-dark">Total Expenses</h3>
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-400" />
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
                  <h3 className="text-sm font-medium text-text dark:text-text-dark">Available Balance</h3>
                  <div className={cn(
                    "h-5 w-5",
                    availableBalance >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {availableBalance >= 0 ? <ArrowTrendingUpIcon /> : <ArrowTrendingDownIcon />}
                  </div>
                </div>
                <p className={cn(
                  "text-xl sm:text-2xl font-semibold",
                  availableBalance >= 0 ? "text-green-400" : "text-red-400"
                )}>
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
              transactions={transactionsWithBalance}
              isLoading={isLoading}
              showActions={true}
              onActionClick={handleEdit}
            />
          </div>
        </div>
      </div>
    </ViewDefault>
  );
} 