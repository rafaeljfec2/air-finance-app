import { MonthlyReport } from '@/types/report';
import { formatCurrency, formatPercentual } from '@/utils/formatters';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface BalanceVariationProps {
  report: MonthlyReport;
}

export function BalanceVariation({ report }: BalanceVariationProps) {
  const { balance } = report.summary;
  const isPositive = balance.variation >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Variação do Saldo</h2>
        <div className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <Icon className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">{isPositive ? 'Aumento' : 'Redução'}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Saldo Atual</span>
          <span className={`text-lg font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(balance.current)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Saldo Anterior</span>
          <span className="text-gray-900 dark:text-white">{formatCurrency(balance.previous)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Variação</span>
          <div className="flex items-center">
            <span className={`text-lg font-semibold mr-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(balance.variation)}
            </span>
            <span className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ({formatPercentual(balance.percentageVariation)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
