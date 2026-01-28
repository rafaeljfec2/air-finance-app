import { TrendingUp, TrendingDown, Equal } from 'lucide-react';
import type { StatementSummary } from '../hooks/types';
import { formatCurrency } from '../utils';

interface AccountSummaryProps {
  readonly summary: StatementSummary;
}

export function AccountSummary({ summary }: Readonly<AccountSummaryProps>) {
  const result = summary.totalCredits - Math.abs(summary.totalDebits);
  const isPositive = result >= 0;

  return (
    <div className="grid grid-cols-3 gap-2 px-4 pt-6 pb-2 lg:gap-2 lg:px-6 lg:pt-8 lg:pb-3">
      <div className="bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark p-2.5 lg:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-green-500" />
          </div>
          <span className="text-[9px] lg:text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Entradas
          </span>
        </div>
        <p className="text-sm lg:text-base font-bold text-green-500 truncate">
          {formatCurrency(summary.totalCredits)}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark p-2.5 lg:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <TrendingDown className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-red-500" />
          </div>
          <span className="text-[9px] lg:text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Saídas
          </span>
        </div>
        <p className="text-sm lg:text-base font-bold text-red-500 truncate">
          {formatCurrency(Math.abs(summary.totalDebits))}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark p-2.5 lg:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div
            className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center ${
              isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            <Equal
              className={`h-2.5 w-2.5 lg:h-3 lg:w-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
            />
          </div>
          <span className="text-[9px] lg:text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Resultado
          </span>
        </div>
        <p
          className={`text-sm lg:text-base font-bold truncate ${isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          {isPositive ? '+' : ''}
          {formatCurrency(result)}
        </p>
      </div>
    </div>
  );
}
