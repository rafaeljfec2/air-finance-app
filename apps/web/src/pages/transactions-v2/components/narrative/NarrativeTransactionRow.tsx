import { PaymentStatusBadge } from '@/components/transactions/PaymentStatusBadge';
import { TransactionActions } from '@/components/transactions/TransactionActions';
import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import { formatTransactionDate } from '@/components/transactions/TransactionGrid.utils';
import { cn } from '@/lib/utils';
import { getCategoryIcon, getCategoryIconColor } from '@/utils/categoryIcons';
import { formatCurrency } from '@/utils/formatters';

import {
  classifyTransactionVisualWeight,
  type TransactionVisualWeight,
} from '../../utils/classifyTransactionVisualWeight';
import type { TransactionContext } from '../../utils/deriveTransactionContext';

import { ContextBadge } from './ContextBadge';

interface NarrativeTransactionRowProps {
  readonly transaction: TransactionGridTransaction;
  readonly context: TransactionContext | null;
  readonly showActions: boolean;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

function weightClasses(weight: TransactionVisualWeight, isIncome: boolean): string {
  if (weight === 'relevant') {
    return cn(
      'px-3 py-2.5',
      isIncome ? 'bg-green-500/5 dark:bg-green-500/10' : 'bg-primary-500/5 dark:bg-primary-500/10',
    );
  }

  if (weight === 'micro') {
    return 'px-3 py-1 opacity-90';
  }

  return 'px-3 py-1.5';
}

export function NarrativeTransactionRow({
  transaction,
  context,
  showActions,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
}: Readonly<NarrativeTransactionRowProps>) {
  const isIncome = transaction.launchType === 'revenue' || transaction.value > 0;
  const absValue = Math.abs(transaction.value);
  const visualWeight = classifyTransactionVisualWeight(absValue);
  const Icon = getCategoryIcon(transaction.categoryId, transaction.launchType);
  const iconBgClass = getCategoryIconColor(transaction.launchType);
  const amountColorClass = isIncome
    ? 'text-green-500 dark:text-green-400'
    : 'text-red-500 dark:text-red-400';

  return (
    <div
      className={cn(
        'border-b border-border/40 transition-colors last:border-b-0 hover:bg-background/40 dark:border-border-dark/40 dark:hover:bg-background-dark/40',
        weightClasses(visualWeight, isIncome),
      )}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg',
            iconBgClass,
            visualWeight === 'relevant' ? 'h-9 w-9' : 'h-7 w-7',
            visualWeight === 'micro' && 'h-6 w-6 rounded-md',
          )}
        >
          <Icon
            className={cn(
              visualWeight === 'relevant' ? 'h-4 w-4' : 'h-3.5 w-3.5',
              visualWeight === 'micro' && 'h-3 w-3',
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <p
              className={cn(
                'truncate font-medium leading-tight text-text dark:text-text-dark',
                visualWeight === 'relevant' ? 'text-sm' : 'text-[13px]',
                visualWeight === 'micro' && 'text-text/85 dark:text-text-dark/85',
              )}
            >
              {transaction.description}
            </p>
            <PaymentStatusBadge
              status={transaction.paymentStatus}
              onRetry={onRetryPayment ? () => onRetryPayment(transaction) : undefined}
            />
            {context && visualWeight !== 'micro' ? <ContextBadge context={context} /> : null}
          </div>

          {visualWeight !== 'micro' ? (
            <p className="mt-0.5 truncate text-[10px] leading-tight text-text-muted dark:text-text-muted-dark">
              {transaction.categoryId || 'Sem categoria'} · {transaction.accountId || 'Sem conta'}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="min-w-[4.5rem] text-right">
            <p
              className={cn(
                'font-semibold leading-tight tabular-nums',
                amountColorClass,
                visualWeight === 'relevant' ? 'text-sm' : 'text-[13px]',
              )}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(absValue)}
            </p>
            <p className="text-[10px] leading-tight text-text-muted dark:text-text-muted-dark">
              {formatTransactionDate(transaction.paymentDate || transaction.createdAt, 'HH:mm')}
            </p>
          </div>

          {transaction.balance !== undefined ? (
            <div className="hidden min-w-[5.5rem] text-right sm:block">
              <p className="text-[9px] uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
                Saldo após
              </p>
              <p
                className={cn(
                  'font-semibold tabular-nums text-text dark:text-text-dark',
                  visualWeight === 'relevant' ? 'text-sm' : 'text-[12px]',
                )}
              >
                {formatCurrency(transaction.balance)}
              </p>
            </div>
          ) : null}

          {showActions ? (
            <TransactionActions
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewHistory={onViewHistory}
              variant="mobile"
            />
          ) : null}
        </div>
      </div>

      {transaction.balance !== undefined ? (
        <p className="mt-1 text-[10px] text-text-muted sm:hidden dark:text-text-muted-dark">
          Saldo após:{' '}
          <span className="font-semibold text-text dark:text-text-dark">
            {formatCurrency(transaction.balance)}
          </span>
        </p>
      ) : null}
    </div>
  );
}
