import { MonthlyReport } from '@/types/report';
import { formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface FinancialSummaryProps {
  report: MonthlyReport;
}

export function FinancialSummary({ report }: FinancialSummaryProps) {
  const { income, expenses } = report.summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card de Receitas */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Receitas</h2>
          <div className="flex items-center text-green-600 dark:text-green-400">
            <ArrowUpIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Entradas</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Total</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(income.total)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Categorias</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {income.categories.length} categorias
            </span>
          </div>
        </div>
      </div>

      {/* Card de Despesas */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Despesas</h2>
          <div className="flex items-center text-red-600 dark:text-red-400">
            <ArrowDownIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Saídas</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Total</span>
            <span className="text-lg font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(expenses.total)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Categorias</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {expenses.categories.length} categorias
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
