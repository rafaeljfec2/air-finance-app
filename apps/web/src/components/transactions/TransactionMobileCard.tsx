import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { getCategoryIcon, getCategoryIconColor } from '@/utils/categoryIcons';
import { memo } from 'react';
import { TransactionActions } from './TransactionActions';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { TransactionGridTransaction } from './TransactionGrid.types';
import { formatTransactionDate } from './TransactionGrid.utils';

interface MobileCardProps {
  readonly transaction: TransactionGridTransaction;
  readonly showActions: boolean;
  readonly onActionClick?: (transaction: TransactionGridTransaction) => void;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

export const MobileCard = memo(
  ({
    transaction,
    showActions,
    onActionClick,
    onEdit,
    onDelete,
    onViewHistory,
    onRetryPayment,
  }: MobileCardProps) => {
    const isPreviousBalance = transaction.id === 'previous-balance';
    const Icon = getCategoryIcon(transaction.categoryId, transaction.launchType);
    const iconColorClass = getCategoryIconColor(transaction.launchType);

    return (
      <div
        className={cn(
          'w-full rounded-lg transition-all text-left',
          isPreviousBalance
            ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-3 border border-primary-200 dark:border-primary-800'
            : 'bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50',
        )}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Ícone da Categoria */}
            {!isPreviousBalance && (
              <div className={cn('p-2 rounded-lg shrink-0', iconColorClass)}>
                <Icon className="h-4 w-4" />
              </div>
            )}

            {/* Conteúdo Principal */}
            <div className="flex-1 min-w-0">
              {/* Descrição */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3
                  className={cn(
                    'font-semibold line-clamp-1',
                    isPreviousBalance
                      ? 'text-sm text-primary-700 dark:text-primary-300'
                      : 'text-sm text-text dark:text-text-dark',
                  )}
                >
                  {transaction.description}
                </h3>
                <PaymentStatusBadge
                  status={transaction.paymentStatus}
                  onRetry={onRetryPayment ? () => onRetryPayment(transaction) : undefined}
                />
              </div>

              {/* Conta */}
              {!isPreviousBalance && transaction.accountId && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 truncate">
                  {transaction.accountId}
                </p>
              )}

              {/* Informações da transação */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {/* Data */}
                <span className="text-gray-500 dark:text-gray-400">
                  {formatTransactionDate(
                    transaction.paymentDate || transaction.createdAt,
                    'dd/MM/yyyy',
                  )}
                </span>

                {!isPreviousBalance && (
                  <>
                    <span className="text-gray-400">•</span>

                    {/* Categoria */}
                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                      {transaction.categoryId || 'Sem categoria'}
                    </span>

                    <span className="text-gray-400">•</span>

                    {/* Valor da Transação */}
                    {transaction.launchType === 'revenue' ? (
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(transaction.value)}
                      </span>
                    ) : (
                      <span className="text-base font-bold text-red-600 dark:text-red-400">
                        -{formatCurrency(transaction.value)}
                      </span>
                    )}
                  </>
                )}

                {isPreviousBalance && (
                  <span className="text-base font-bold text-primary-700 dark:text-primary-300">
                    {formatCurrency(transaction.value)}
                  </span>
                )}
              </div>

              {/* Saldo */}
              {transaction.balance !== undefined && (
                <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                  Saldo:{' '}
                  <span
                    className={cn(
                      'font-semibold',
                      (transaction.balance ?? 0) >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400',
                    )}
                  >
                    {formatCurrency(transaction.balance)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ações - Menu vertical no canto direito */}
          {showActions && !isPreviousBalance && (
            <div className="shrink-0">
              <TransactionActions
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
                onActionClick={onActionClick}
                onViewHistory={onViewHistory}
                variant="mobile"
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

MobileCard.displayName = 'MobileCard';
