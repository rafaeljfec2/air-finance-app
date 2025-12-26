import { formatCurrency } from '@/utils/formatters';
import { Banknote, TrendingDown, TrendingUp } from 'lucide-react';

interface StatementSummaryProps {
  balance: number;
  income: number;
  expenses: number;
  previousBalance?: number;
  previousIncome?: number;
  previousExpenses?: number;
}

export function StatementSummary({ 
  balance, 
  income, 
  expenses,
  previousBalance = 0,
  previousIncome = 0,
  previousExpenses = 0
}: StatementSummaryProps) {
  const balanceVariation = previousBalance ? ((balance - previousBalance) / previousBalance) * 100 : 0;
  const incomeVariation = previousIncome ? ((income - previousIncome) / previousIncome) * 100 : 0;
  const expensesVariation = previousExpenses ? ((expenses - previousExpenses) / previousExpenses) * 100 : 0;

  const renderVariation = (variation: number) => {
    if (variation === 0) return null;
    
    return (
      <span className={`inline-flex items-center text-sm ${
        variation > 0 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-600 dark:text-red-400'
      }`}>
        {variation > 0 ? (
          <TrendingUp className="h-4 w-4 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 mr-1" />
        )}
        {Math.abs(variation).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-500/10 dark:bg-primary-400/10">
          <Banknote className="h-12 w-12 absolute bottom-4 left-4 text-primary-500/40 dark:text-primary-400/40" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Disponível</h3>
        <div className="mt-2">
          <p className={`text-3xl font-bold ${
            balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(balance)}
          </p>
          {renderVariation(balanceVariation)}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-500/10 dark:bg-green-400/10">
          <TrendingUp className="h-12 w-12 absolute bottom-4 left-4 text-green-500/40 dark:text-green-400/40" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</h3>
        <div className="mt-2">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(income)}
          </p>
          {renderVariation(incomeVariation)}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-red-500/10 dark:bg-red-400/10">
          <TrendingDown className="h-12 w-12 absolute bottom-4 left-4 text-red-500/40 dark:text-red-400/40" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</h3>
        <div className="mt-2">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(expenses)}
          </p>
          {renderVariation(expensesVariation)}
        </div>
      </div>
    </div>
  );
}
