import { memo } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { TransactionActions } from './TransactionActions';
import { formatTransactionDate } from './TransactionGrid.utils';
import type { TransactionGridTransaction } from './TransactionGrid.types';

interface TableRowProps {
  transaction: TransactionGridTransaction;
  showActions: boolean;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
}

export const TableRow = memo(
  ({ transaction, showActions, onActionClick, onEdit, onDelete }: TableRowProps) => {
    return (
      <tr className="hover:bg-background/70 dark:hover:bg-background-dark/70 transition-colors">
        <td className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatTransactionDate(transaction.paymentDate || transaction.createdAt)}
        </td>
        <td className="py-2 px-4 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis">
          <Tooltip content={transaction.categoryId || 'Sem categoria'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.categoryId || 'Sem categoria'}
            </span>
          </Tooltip>
        </td>
        <td className="py-2 px-4 text-xs font-medium text-text dark:text-text-dark overflow-hidden text-ellipsis">
          <Tooltip content={transaction.description || 'Sem descrição'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.description || 'Sem descrição'}
            </span>
          </Tooltip>
        </td>
        <td className="py-2 px-4 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis">
          <Tooltip content={transaction.accountId || 'Sem conta'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.accountId || 'Sem conta'}
            </span>
          </Tooltip>
        </td>
        <td className="py-2 pl-0 pr-8 text-xs font-medium text-right text-emerald-400 whitespace-nowrap">
          {transaction.launchType === 'revenue' ? formatCurrency(transaction.value) : '-'}
        </td>
        <td className="py-2 pl-0 pr-8 text-xs font-medium text-right text-red-400 whitespace-nowrap">
          {transaction.launchType === 'expense' ? formatCurrency(transaction.value) : '-'}
        </td>
        <td
          className={cn(
            'py-2 pl-0 pr-8 text-xs font-medium text-right whitespace-nowrap',
            (transaction.balance ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {(transaction.balance ?? 0) >= 0
            ? `+${formatCurrency(Math.abs(transaction.balance ?? 0))}`
            : formatCurrency(transaction.balance ?? 0)}
        </td>
        {showActions && (
          <td className="py-2 px-4">
            <TransactionActions
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              onActionClick={onActionClick}
              variant="table"
            />
          </td>
        )}
      </tr>
    );
  },
);

TableRow.displayName = 'TableRow';
