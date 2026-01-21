import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { memo } from 'react';
import { TransactionActions } from './TransactionActions';
import type { TransactionGridTransaction } from './TransactionGrid.types';
import { formatTransactionDate } from './TransactionGrid.utils';

interface TableRowProps {
  transaction: TransactionGridTransaction;
  showActions: boolean;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
  onViewHistory?: (transaction: TransactionGridTransaction) => void;
}

import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const TableRow = memo(
  ({ transaction, showActions, onActionClick, onEdit, onDelete, onViewHistory }: TableRowProps) => {
    const isPreviousBalance = transaction.id === 'previous-balance';

    return (
      <tr
        className={cn(
          'transition-colors border-b border-border/50 dark:border-border-dark/50 last:border-0',
          isPreviousBalance
            ? 'bg-gray-50/80 dark:bg-gray-900/40 italic font-medium'
            : 'hover:bg-muted/50 dark:hover:bg-muted/50',
        )}
        style={{ height: 'auto', lineHeight: '1.25' }}
      >
        <td className="py-1 px-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap align-middle">
          {formatTransactionDate(transaction.paymentDate || transaction.createdAt, 'dd/MM/yyyy')}
        </td>
        <td className="py-1 px-2 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis align-middle">
          <div className="flex items-center gap-1.5">
            {!isPreviousBalance && (
              transaction.launchType === 'revenue' ? (
                <ArrowUpCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
              ) : (
                <ArrowDownCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
              )
            )}
            <Tooltip content={transaction.categoryId || 'Sem categoria'}>
              <span className="block overflow-hidden text-ellipsis">
                {transaction.categoryId || 'Sem categoria'}
              </span>
            </Tooltip>
          </div>
        </td>
        <td className="py-1 px-2 text-xs font-medium text-text dark:text-text-dark overflow-hidden text-ellipsis align-middle">
          <Tooltip content={transaction.description || 'Sem descrição'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.description || 'Sem descrição'}
            </span>
          </Tooltip>
        </td>
        <td className="py-1 px-2 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis align-middle">
          <Tooltip content={transaction.accountId || 'Sem conta'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.accountId || 'Sem conta'}
            </span>
          </Tooltip>
        </td>
        <td className="py-1 pl-0 pr-4 text-xs font-medium text-right text-emerald-400 whitespace-nowrap align-middle">
          {isPreviousBalance
            ? '-'
            : transaction.launchType === 'revenue'
              ? formatCurrency(transaction.value)
              : '-'}
        </td>
        <td className="py-1 pl-0 pr-4 text-xs font-medium text-right text-red-400 whitespace-nowrap align-middle">
          {isPreviousBalance
            ? '-'
            : transaction.launchType === 'expense'
              ? formatCurrency(transaction.value)
              : '-'}
        </td>
        <td
          className={cn(
            'py-1 pl-0 pr-4 text-xs font-medium text-right whitespace-nowrap align-middle',
            (transaction.balance ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {(transaction.balance ?? 0) >= 0
            ? `+${formatCurrency(Math.abs(transaction.balance ?? 0))}`
            : formatCurrency(transaction.balance ?? 0)}
        </td>
        {showActions && !isPreviousBalance && (
          <td className="py-1 px-2 align-middle">
            <TransactionActions
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              onActionClick={onActionClick}
              onViewHistory={onViewHistory}
              variant="table"
            />
          </td>
        )}
        {showActions && isPreviousBalance && <td className="py-1 px-2 align-middle" />}
      </tr>
    );
  },
);

TableRow.displayName = 'TableRow';
