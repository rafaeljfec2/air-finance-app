import { formatCurrency } from '@/utils/formatters';
import { useMemo } from 'react';
import type { TransactionGridTransaction } from './TransactionGrid.types';
import { EmptyState } from './EmptyState';
import { MobileCard } from './TransactionMobileCard';

interface TransactionMobileListProps {
  readonly transactions: TransactionGridTransaction[];
  readonly paginatedItems: TransactionGridTransaction[];
  readonly showActions: boolean;
  readonly onActionClick: (transaction: TransactionGridTransaction) => void;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

export function TransactionMobileList({
  transactions,
  paginatedItems,
  showActions,
  onActionClick,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
}: Readonly<TransactionMobileListProps>) {
  const hasItems = paginatedItems.length > 0;

  const { totalCredits, totalDebits } = useMemo(() => {
    let credits = 0;
    let debits = 0;
    for (const t of transactions) {
      if (t.id === 'previous-balance') continue;
      if (t.launchType === 'revenue') credits += t.value;
      else if (t.launchType === 'expense') debits += t.value;
    }
    return { totalCredits: credits, totalDebits: debits };
  }, [transactions]);

  return (
    <div className="md:hidden space-y-2 min-h-[320px]">
      {hasItems ? (
        <>
          {paginatedItems.map((transaction) => (
            <MobileCard
              key={transaction.id}
              transaction={transaction}
              showActions={showActions}
              onActionClick={onActionClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewHistory={onViewHistory}
              onRetryPayment={onRetryPayment}
            />
          ))}
          <div className="rounded-lg border-2 border-border dark:border-border-dark bg-muted/40 dark:bg-muted-dark/40 p-3">
            <p className="text-xs font-semibold text-foreground dark:text-foreground-dark mb-2">
              Total
            </p>
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground dark:text-muted-foreground-dark">
                  Crédito
                </p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(Math.abs(totalCredits))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground dark:text-muted-foreground-dark">
                  Débito
                </p>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(Math.abs(totalDebits))}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState variant="mobile" />
      )}
    </div>
  );
}
