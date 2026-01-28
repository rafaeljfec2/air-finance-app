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
    <div className="grid grid-cols-3 gap-3 px-4 py-4 lg:px-6">
      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          </div>
          <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Entradas
          </span>
        </div>
        <p className="text-lg font-bold text-green-500">{formatCurrency(summary.totalCredits)}</p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          </div>
          <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Saídas
          </span>
        </div>
        <p className="text-lg font-bold text-red-500">
          {formatCurrency(Math.abs(summary.totalDebits))}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            <Equal className={`h-3.5 w-3.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Resultado
          </span>
        </div>
        <p className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}
          {formatCurrency(result)}
        </p>
      </div>
    </div>
  );
}
