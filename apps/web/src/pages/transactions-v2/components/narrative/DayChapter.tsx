import { useMemo } from 'react';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

import type { DayNarrative } from '../../utils/buildDayNarrative';
import { classifyTransactionVisualWeight } from '../../utils/classifyTransactionVisualWeight';
import {
  countCategoryPurchasesUpToTransaction,
  deriveTransactionContext,
} from '../../utils/deriveTransactionContext';

import { DayChapterCard } from './DayChapterCard';
import { MicroMovementsDisclosure } from './MicroMovementsDisclosure';
import { NarrativeTransactionRow } from './NarrativeTransactionRow';
import { TimelineRail } from './TimelineRail';

interface DayChapterProps {
  readonly dayKey: string;
  readonly narrative: DayNarrative;
  readonly pageTransactions: readonly TransactionGridTransaction[];
  readonly allTransactions: readonly TransactionGridTransaction[];
  readonly isLast: boolean;
  readonly showActions: boolean;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

function PreviousBalanceChapter({
  transaction,
}: Readonly<{ transaction: TransactionGridTransaction }>) {
  return (
    <section className="flex gap-3 px-3 py-3">
      <TimelineRail hasInflow={false} isLast />
      <div className="min-w-0 flex-1 rounded-xl border border-primary-500/20 bg-primary-500/5 px-3 py-2.5 dark:border-primary-400/20 dark:bg-primary-500/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
              Ponto de partida
            </p>
            <p className="mt-0.5 text-sm font-medium text-text dark:text-text-dark">
              {transaction.description}
            </p>
          </div>
          <p className="text-base font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(transaction.balance ?? transaction.value)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function DayChapter({
  dayKey,
  narrative,
  pageTransactions,
  allTransactions,
  isLast,
  showActions,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
}: Readonly<DayChapterProps>) {
  const previousBalance = pageTransactions.find((tx) => tx.id === 'previous-balance');

  const { primaryRows, microRows } = useMemo(() => {
    const movements = pageTransactions.filter((tx) => tx.id !== 'previous-balance');
    const primary: TransactionGridTransaction[] = [];
    const micro: TransactionGridTransaction[] = [];

    movements.forEach((transaction) => {
      const weight = classifyTransactionVisualWeight(Math.abs(transaction.value));
      if (weight === 'micro') {
        micro.push(transaction);
      } else {
        primary.push(transaction);
      }
    });

    return { primaryRows: primary, microRows: micro };
  }, [pageTransactions]);

  const resolveContext = (transaction: TransactionGridTransaction) => {
    const categoryProgress = countCategoryPurchasesUpToTransaction(allTransactions, transaction);
    return deriveTransactionContext({
      transaction,
      dayBiggestExpenseId: narrative.biggestExpenseId,
      categoryMonthCount: categoryProgress.count,
      isFirstCategoryPurchaseInMonth: categoryProgress.isFirst,
    });
  };

  if (dayKey === 'previous-balance' && previousBalance) {
    return <PreviousBalanceChapter transaction={previousBalance} />;
  }

  const renderRow = (transaction: TransactionGridTransaction) => (
    <NarrativeTransactionRow
      key={transaction.id}
      transaction={transaction}
      context={resolveContext(transaction)}
      showActions={showActions}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewHistory={onViewHistory}
      onRetryPayment={onRetryPayment}
    />
  );

  return (
    <section className={cn('flex gap-2 px-2 py-3 sm:gap-3 sm:px-3', !isLast && 'pb-1')}>
      <TimelineRail hasInflow={narrative.hasInflow} isLast={isLast} className="pt-1" />

      <div className="grid min-w-0 flex-1 gap-2 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-3">
        <div className="lg:sticky lg:top-2 lg:self-start">
          <div className="lg:hidden">
            <DayChapterCard narrative={narrative} compact />
          </div>
          <div className="hidden lg:block">
            <DayChapterCard narrative={narrative} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark">
          {primaryRows.length === 0 && microRows.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-text-muted dark:text-text-muted-dark">
              Nenhum movimento deste dia na página atual.
            </p>
          ) : (
            <>
              {primaryRows.map(renderRow)}
              <MicroMovementsDisclosure microCount={microRows.length}>
                {microRows.map(renderRow)}
              </MicroMovementsDisclosure>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
