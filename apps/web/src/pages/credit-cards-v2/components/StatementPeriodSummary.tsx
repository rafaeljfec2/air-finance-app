import { ArrowDownLeft, ArrowUpRight, List } from 'lucide-react';

import { formatCurrency } from '@/pages/credit-cards/bills/utils';

interface StatementPeriodSummaryProps {
  readonly totalDebit: number;
  readonly totalCredit: number;
  readonly transactionCount: number;
}

export function StatementPeriodSummary({
  totalDebit,
  totalCredit,
  transactionCount,
}: Readonly<StatementPeriodSummaryProps>) {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 pb-2 pt-3 lg:gap-2 lg:px-6 lg:pb-3 lg:pt-4">
      <div className="rounded-lg border border-border bg-card p-2.5 dark:border-border-dark dark:bg-card-dark lg:p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 lg:h-5 lg:w-5">
            <ArrowUpRight className="h-2.5 w-2.5 text-red-500 lg:h-3 lg:w-3" />
          </div>
          <span className="text-[9px] font-medium uppercase tracking-wide text-text-muted dark:text-text-muted-dark lg:text-[10px]">
            Débitos
          </span>
        </div>
        <p className="truncate text-sm font-bold text-red-500 lg:text-base">
          {formatCurrency(totalDebit)}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-2.5 dark:border-border-dark dark:bg-card-dark lg:p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 lg:h-5 lg:w-5">
            <ArrowDownLeft className="h-2.5 w-2.5 text-green-500 lg:h-3 lg:w-3" />
          </div>
          <span className="text-[9px] font-medium uppercase tracking-wide text-text-muted dark:text-text-muted-dark lg:text-[10px]">
            Créditos
          </span>
        </div>
        <p className="truncate text-sm font-bold text-green-500 lg:text-base">
          {formatCurrency(totalCredit)}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-2.5 dark:border-border-dark dark:bg-card-dark lg:p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 lg:h-5 lg:w-5">
            <List className="h-2.5 w-2.5 text-blue-500 lg:h-3 lg:w-3" />
          </div>
          <span className="text-[9px] font-medium uppercase tracking-wide text-text-muted dark:text-text-muted-dark lg:text-[10px]">
            Lançamentos
          </span>
        </div>
        <p className="truncate text-sm font-bold text-blue-500 lg:text-base">{transactionCount}</p>
      </div>
    </div>
  );
}
