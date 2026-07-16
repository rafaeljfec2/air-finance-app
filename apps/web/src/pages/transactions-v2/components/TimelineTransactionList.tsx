import { useMemo } from 'react';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

import { buildDayNarrativesByKey } from '../utils/buildDayNarrative';
import { groupTransactionsByDay } from '../utils/groupTransactionsByDay';

import { DayChapter } from './narrative/DayChapter';

interface TimelineTransactionListProps {
  readonly transactions: readonly TransactionGridTransaction[];
  readonly allTransactions: readonly TransactionGridTransaction[];
  readonly showActions: boolean;
  readonly emptyMessage?: string;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

export function TimelineTransactionList({
  transactions,
  allTransactions,
  showActions,
  emptyMessage = 'Nenhum movimento neste período.',
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
}: Readonly<TimelineTransactionListProps>) {
  const pageGroups = useMemo(() => groupTransactionsByDay(transactions), [transactions]);
  const narrativesByDay = useMemo(
    () => buildDayNarrativesByKey(allTransactions),
    [allTransactions],
  );

  if (transactions.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border/30 dark:divide-border-dark/30">
      {pageGroups.map((group, index) => {
        const narrative = narrativesByDay.get(group.dayKey) ?? {
          dayKey: group.dayKey,
          movementCount: group.transactions.filter((tx) => tx.id !== 'previous-balance').length,
          totalOutflows: 0,
          totalInflows: 0,
          biggestExpense: null,
          biggestExpenseId: null,
          endOfDayBalance: null,
          hasInflow: false,
        };

        return (
          <DayChapter
            key={group.dayKey}
            dayKey={group.dayKey}
            narrative={narrative}
            pageTransactions={group.transactions}
            allTransactions={allTransactions}
            isLast={index === pageGroups.length - 1}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewHistory={onViewHistory}
            onRetryPayment={onRetryPayment}
          />
        );
      })}
    </div>
  );
}
