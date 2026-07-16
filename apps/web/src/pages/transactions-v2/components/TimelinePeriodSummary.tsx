import { Receipt } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

interface TimelinePeriodSummaryProps {
  readonly totalDebits: number;
  readonly totalCredits: number;
  readonly movementCount: number;
  readonly periodBalance?: number;
  readonly className?: string;
}

export function TimelinePeriodSummary({
  totalDebits,
  totalCredits,
  movementCount,
  periodBalance,
  className,
}: Readonly<TimelinePeriodSummaryProps>) {
  const movementLabel = movementCount === 1 ? 'movimento' : 'movimentos';

  return (
    <div className={cn('px-4 pt-3 lg:px-6', className)}>
      <div className="grid grid-cols-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-4 sm:divide-x sm:divide-y-0 dark:divide-border-dark dark:border-border-dark dark:bg-card-dark">
        <div className="flex items-center gap-2.5 px-4 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background dark:bg-background-dark">
            <Receipt className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-text dark:text-text-dark">
              {movementCount}
            </p>
            <p className="text-[11px] text-text-muted dark:text-text-muted-dark">{movementLabel}</p>
          </div>
        </div>

        <div className="px-4 py-2.5">
          <p className="text-[11px] text-text-muted dark:text-text-muted-dark">Entradas</p>
          <p className="text-sm font-bold leading-tight tabular-nums text-green-500">
            {formatCurrency(totalCredits)}
          </p>
        </div>

        <div className="px-4 py-2.5">
          <p className="text-[11px] text-text-muted dark:text-text-muted-dark">Saídas</p>
          <p className="text-sm font-bold leading-tight tabular-nums text-red-500">
            {formatCurrency(totalDebits)}
          </p>
        </div>

        <div className="px-4 py-2.5">
          <p className="text-[11px] text-text-muted dark:text-text-muted-dark">Saldo do período</p>
          <p
            className={cn(
              'text-sm font-bold leading-tight tabular-nums',
              (periodBalance ?? 0) >= 0 ? 'text-blue-500 dark:text-blue-400' : 'text-red-500',
            )}
          >
            {formatCurrency(periodBalance ?? totalCredits - totalDebits)}
          </p>
        </div>
      </div>
    </div>
  );
}
