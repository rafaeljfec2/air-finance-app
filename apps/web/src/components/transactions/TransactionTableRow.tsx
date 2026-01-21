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
  spacious?: boolean;
}

export const TableRow = memo(
  ({ transaction, showActions, onActionClick, onEdit, onDelete, onViewHistory, spacious = false }: TableRowProps) => {
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

    // Estilos espaçosos quando spacious=true (aumenta altura das linhas)
    const cellPadding = spacious ? { paddingTop: '8px', paddingBottom: '8px', lineHeight: '1.5' } : undefined;
    const rowStyle = spacious ? { height: 'auto', lineHeight: '1.5' } : { height: 'auto', lineHeight: '1.25' };
    const cellPaddingClass = spacious ? 'py-2 px-2' : 'py-1 px-2';
    const numericCellPaddingClass = spacious ? 'py-2 pl-0 pr-4' : 'py-1 pl-0 pr-4';

    return (
      <tr
        className={getRowClassName()}
        style={rowStyle}
      >
        <td className={cn(cellPaddingClass, "text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap align-middle")} style={cellPadding}>
          {formatTransactionDate(transaction.paymentDate || transaction.createdAt, 'dd/MM/yyyy')}
        </td>
        <td className={cn(cellPaddingClass, "text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis align-middle")} style={cellPadding}>
          <div className="flex items-center gap-1.5">
            {getCategoryIcon()}
            <Tooltip content={transaction.categoryId || 'Sem categoria'}>
              <span className="block overflow-hidden text-ellipsis">
                {transaction.categoryId || 'Sem categoria'}
              </span>
            </Tooltip>
          </div>
        </td>
        <td className={cn(cellPaddingClass, "text-xs font-medium text-text dark:text-text-dark overflow-hidden text-ellipsis align-middle")} style={cellPadding}>
          <Tooltip content={transaction.description || 'Sem descrição'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.description || 'Sem descrição'}
            </span>
          </Tooltip>
        </td>
        <td className={cn(cellPaddingClass, "text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis align-middle")} style={cellPadding}>
          <Tooltip content={transaction.accountId || 'Sem conta'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.accountId || 'Sem conta'}
            </span>
          </Tooltip>
        </td>
        <td className={cn(numericCellPaddingClass, "text-xs font-medium text-right text-emerald-400 whitespace-nowrap align-middle")} style={cellPadding}>
          {getCreditValue()}
        </td>
        <td className={cn(numericCellPaddingClass, "text-xs font-medium text-right text-red-400 whitespace-nowrap align-middle")} style={cellPadding}>
          {getDebitValue()}
        </td>
        <td
          className={cn(
            numericCellPaddingClass,
            'text-xs font-medium text-right whitespace-nowrap align-middle',
            getBalanceColor(),
          )}
          style={cellPadding}
        >
          {getBalanceDisplay()}
        </td>
        {showActions && !isPreviousBalance && (
          <td className={cn(cellPaddingClass, "align-middle")} style={cellPadding}>
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
        {showActions && isPreviousBalance && <td className={cn(cellPaddingClass, "align-middle")} style={cellPadding} />}
      </tr>
    );
  },
);

TableRow.displayName = 'TableRow';
