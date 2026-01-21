import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { memo } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
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

export const TableRow = memo(
  ({ transaction, showActions, onActionClick, onEdit, onDelete, onViewHistory }: TableRowProps) => {
    const isPreviousBalance = transaction.id === 'previous-balance';

    // Extrair lógica dos ternários aninhados para variáveis separadas
    const getCreditValue = () => {
      if (isPreviousBalance) return '-';
      if (transaction.launchType === 'revenue') return formatCurrency(transaction.value);
      return '-';
    };

    const getDebitValue = () => {
      if (isPreviousBalance) return '-';
      if (transaction.launchType === 'expense') return formatCurrency(transaction.value);
      return '-';
    };

    const getRowClassName = () => {
      const baseClasses = 'transition-colors border-b border-border/50 dark:border-border-dark/50 last:border-0';
      if (isPreviousBalance) {
        return cn(baseClasses, 'bg-gray-50/80 dark:bg-gray-900/40 italic font-medium');
      }
      return cn(baseClasses, 'hover:bg-muted/50 dark:hover:bg-muted/50');
    };

    const getCategoryIcon = () => {
      if (isPreviousBalance) return null;
      if (transaction.launchType === 'revenue') {
        return <ArrowUpCircle className="h-3 w-3 text-green-500 flex-shrink-0" />;
      }
      return <ArrowDownCircle className="h-3 w-3 text-red-500 flex-shrink-0" />;
    };

    const getBalanceDisplay = () => {
      const balance = transaction.balance ?? 0;
      if (balance >= 0) {
        return `+${formatCurrency(Math.abs(balance))}`;
      }
      return formatCurrency(balance);
    };

    const getBalanceColor = () => {
      return (transaction.balance ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400';
    };

    return (
      <tr
        className={getRowClassName()}
        style={{ height: 'auto', lineHeight: '1.25' }}
      >
        <td className="py-1 px-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap align-middle">
          {formatTransactionDate(transaction.paymentDate || transaction.createdAt, 'dd/MM/yyyy')}
        </td>
        <td className="py-1 px-2 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis align-middle">
          <div className="flex items-center gap-1.5">
            {getCategoryIcon()}
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
          {getCreditValue()}
        </td>
        <td className="py-1 pl-0 pr-4 text-xs font-medium text-right text-red-400 whitespace-nowrap align-middle">
          {getDebitValue()}
        </td>
        <td
          className={cn(
            'py-1 pl-0 pr-4 text-xs font-medium text-right whitespace-nowrap align-middle',
            getBalanceColor(),
          )}
        >
          {getBalanceDisplay()}
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
