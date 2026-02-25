import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { useMemo } from 'react';
import type {
  FilterValue,
  SortDirection,
  SortField,
  TransactionGridTransaction,
} from './TransactionGrid.types';
import { getFieldValues } from './TransactionGrid.utils';
import { EmptyState } from './EmptyState';
import { SortableHeader } from './SortableHeader';
import { TableRow } from './TransactionTableRow';

interface TransactionTableProps {
  allTransactions: TransactionGridTransaction[];
  filteredTransactions: TransactionGridTransaction[];
  paginatedItems: TransactionGridTransaction[];
  showActions: boolean;
  spacious: boolean;
  sortConfig: { field: SortField; direction: SortDirection };
  filters: FilterValue[];
  activeFilter: SortField | null;
  onSort: (field: SortField) => void;
  onFilterClick: (field: SortField) => void;
  onFilter: (field: SortField, values: Set<string>) => void;
  onCloseFilter: () => void;
  onActionClick: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
  onViewHistory?: (transaction: TransactionGridTransaction) => void;
  onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

export function TransactionTable({
  allTransactions,
  filteredTransactions,
  paginatedItems,
  showActions,
  spacious,
  sortConfig,
  filters,
  activeFilter,
  onSort,
  onFilterClick,
  onFilter,
  onCloseFilter,
  onActionClick,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
}: Readonly<TransactionTableProps>) {
  const headerProps = {
    sortConfig,
    filters,
    activeFilter,
    onSort,
    onFilterClick,
    onFilter,
    onCloseFilter,
    getFieldValues,
    transactions: allTransactions,
    spacious,
  };

  const hasItems = paginatedItems.length > 0;

  const { totalCredits, totalDebits } = useMemo(() => {
    let credits = 0;
    let debits = 0;
    for (const t of filteredTransactions) {
      if (t.id === 'previous-balance') continue;
      if (t.launchType === 'revenue') credits += t.value;
      else if (t.launchType === 'expense') debits += t.value;
    }
    return { totalCredits: credits, totalDebits: debits };
  }, [filteredTransactions]);

  return (
    <div className="hidden md:block">
      <div className="w-full min-h-[240px]">
        <table
          className={cn('w-full table-fixed text-xs', spacious && 'transaction-grid-spacious')}
        >
          <colgroup>
            <col className="w-[6%] sm:w-[8%]" />
            <col className="w-[12%] sm:w-[15%]" />
            <col className="w-[20%] sm:w-[25%]" />
            <col className="w-[14%] sm:w-[18%]" />
            <col className="w-[11%] text-right" />
            <col className="w-[11%] text-right" />
            <col className="w-[11%] text-right" />
          </colgroup>
          <thead>
            <tr className="bg-background/30 dark:bg-background-dark/30">
              <SortableHeader field="date" {...headerProps}>
                Data/Hora
              </SortableHeader>
              <SortableHeader field="category" {...headerProps}>
                Categoria
              </SortableHeader>
              <SortableHeader field="description" {...headerProps}>
                Descrição
              </SortableHeader>
              <SortableHeader field="account" {...headerProps}>
                Conta
              </SortableHeader>
              <SortableHeader field="credit" className="text-right pl-0 pr-4" {...headerProps}>
                Crédito
              </SortableHeader>
              <SortableHeader field="debit" className="text-right pl-0 pr-4" {...headerProps}>
                Débito
              </SortableHeader>
              <SortableHeader field="balance" className="text-right pl-0 pr-4" {...headerProps}>
                Saldo
              </SortableHeader>
              {showActions && (
                <th
                  className={cn(
                    'w-20 text-left px-2 text-xs font-medium text-gray-500 dark:text-gray-400 align-middle',
                    spacious ? 'py-2' : 'py-1.5',
                  )}
                  style={
                    spacious
                      ? { paddingTop: '12px', paddingBottom: '12px', lineHeight: '1.5' }
                      : undefined
                  }
                >
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
            {hasItems ? (
              paginatedItems.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  transaction={transaction}
                  showActions={showActions}
                  onActionClick={onActionClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewHistory={onViewHistory}
                  onRetryPayment={onRetryPayment}
                  spacious={spacious}
                />
              ))
            ) : (
              <EmptyState colSpan={showActions ? 8 : 7} />
            )}
          </tbody>
          {hasItems && (
            <tfoot>
              <tr className="bg-muted/40 dark:bg-muted-dark/40 border-t-2 border-border dark:border-border-dark">
                <td
                  colSpan={4}
                  className="px-2 py-2 text-xs font-semibold text-foreground dark:text-foreground-dark text-right"
                >
                  Total
                </td>
                <td className="px-2 py-2 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(Math.abs(totalCredits))}
                </td>
                <td className="px-2 py-2 text-right text-xs font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(Math.abs(totalDebits))}
                </td>
                <td className="px-2 py-2" />
                {showActions && <td className="px-2 py-2" />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
