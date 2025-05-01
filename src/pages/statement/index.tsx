import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';
import { StatementSummary } from '@/components/statement/StatementSummary';
import { TransactionList } from '@/components/statement/TransactionList';
import { StatementFilters } from '@/components/statement/StatementFilters';
import { useStatementStore } from '@/stores/statement';
import { Transaction } from '@/types/transaction';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { ExclamationTriangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
      ? transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? transaction.categoria.id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = async (transaction: Transaction) => {
    // TODO: Implement edit modal
    console.log('Edit transaction:', transaction);
  };

  const handleRemove = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta transação?')) {
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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center max-w-md mx-auto p-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            
            {/* Detalhes técnicos do erro */}
            <div className="mb-6">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ChevronDownIcon 
                  className={`h-5 w-5 mr-1 transition-transform ${showErrorDetails ? 'transform rotate-180' : ''}`}
                />
                Detalhes técnicos
              </button>
              
              {showErrorDetails && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                  <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {JSON.stringify(errorDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => loadTransactions()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div {...containerProps} className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Extrato Financeiro
          </h1>

          <StatementSummary 
            balance={availableBalance}
            income={income}
            expenses={expenses}
            previousBalance={previousBalance}
            previousIncome={previousIncome}
            previousExpenses={previousExpenses}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transações</h2>

            <button
              onClick={() => navigate('/transactions/new')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Nova Transação
            </button>
          </div>

          <StatementFilters
            categories={categories}
            onSearch={handleSearch}
            onFilterCategory={handleFilterCategory}
          />

          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onRefresh={loadTransactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ViewDefault>
  );
} 