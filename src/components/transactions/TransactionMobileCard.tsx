import { memo } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { TransactionActions } from './TransactionActions';
import { formatTransactionDate } from './TransactionGrid.utils';
import type { TransactionGridTransaction } from './TransactionGrid.types';

interface MobileCardProps {
  transaction: TransactionGridTransaction;
  showActions: boolean;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
}

export const MobileCard = memo(
  ({ transaction, showActions, onActionClick, onEdit, onDelete }: MobileCardProps) => {
    return (
      <div
        className="w-full bg-card dark:bg-card-dark rounded-lg p-4 hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatTransactionDate(transaction.paymentDate || transaction.createdAt, 'dd/MM HH:mm')}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {transaction.categoryId || 'Sem categoria'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-text dark:text-text-dark mb-1 truncate">
              {transaction.description}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {transaction.accountId || 'Sem conta'}
            </p>
          </div>
          <div className="text-right flex flex-col items-end justify-between h-full">
            {transaction.launchType === 'revenue' ? (
              <span className="text-sm font-medium text-emerald-400">
                +{formatCurrency(transaction.value)}
              </span>
            ) : (
              <span className="text-sm font-medium text-red-400">
                -{formatCurrency(transaction.value)}
              </span>
            )}
            <span
              className={cn(
                'text-xs mt-1',
                (transaction.balance ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400',
              )}
            >
              {(transaction.balance ?? 0) >= 0
                ? `+${formatCurrency(Math.abs(transaction.balance ?? 0))}`
                : formatCurrency(transaction.balance ?? 0)}
            </span>
          </div>
        </div>
        {showActions && (
          <div className="mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50">
            <TransactionActions
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              onActionClick={onActionClick}
              variant="mobile"
            />
          </div>
        )}
      </div>
    );
  },
);

MobileCard.displayName = 'MobileCard';

