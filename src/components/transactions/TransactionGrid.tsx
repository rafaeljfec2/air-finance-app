import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { TableRow } from './TransactionTableRow';
import { MobileCard } from './TransactionMobileCard';
import { SortableHeader } from './SortableHeader';
import { PaginationControls } from './PaginationControls';
import { useTransactionSorting } from './hooks/useTransactionSorting';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { usePagination } from './hooks/usePagination';
import { calculateBalance, getFieldValues } from './TransactionGrid.utils';
import type {
  TransactionGridProps,
  TransactionGridTransaction,
  SortField,
  SortDirection,
  FilterValue,
} from './TransactionGrid.types';

export function TransactionGrid({
  transactions,
  isLoading = false,
  showActions = true,
  onActionClick,
  onEdit,
  onDelete,
  className,
}: Readonly<TransactionGridProps>) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'date',
    direction: 'asc',
  });
  const [activeFilter, setActiveFilter] = useState<SortField | null>(null);
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const { sortTransactions } = useTransactionSorting(sortConfig);
  const { getFilteredTransactions } = useTransactionFilters(filters);
  const {
    currentPage,
    itemsPerPageSelected,
    paginate,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(10);

  const handleFilterClick = useCallback(
    (field: SortField) => {
      setActiveFilter(activeFilter === field ? null : field);
    },
    [activeFilter],
  );

  const handleFilter = useCallback((field: SortField, values: Set<string>) => {
    setFilters((prev) => {
      const newFilters = prev.filter((f) => f.field !== field);
      if (values.size > 0) {
        newFilters.push({ field, values });
      }
      return newFilters;
    });
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const transactionsWithBalance = useMemo(() => calculateBalance(transactions), [transactions]);

  const sortedAndFilteredTransactions = useMemo(() => {
    const filtered = getFilteredTransactions(transactionsWithBalance);
    return sortTransactions(filtered);
  }, [getFilteredTransactions, sortTransactions, transactionsWithBalance]);

  const { paginatedItems, totalPages, startIndex, endIndex, totalItems } = useMemo(
    () => paginate(sortedAndFilteredTransactions),
    [paginate, sortedAndFilteredTransactions],
  );

  // Calculate totals for footer
  const totals = useMemo(() => {
    let totalCredits = 0;
    let totalDebits = 0;
    let finalBalance = 0;

    sortedAndFilteredTransactions.forEach((transaction) => {
      // Skip previous balance row for totals calculation
      if (transaction.id === 'previous-balance') {
        finalBalance = transaction.balance ?? 0;
        return;
      }

      if (transaction.launchType === 'revenue') {
        totalCredits += Math.abs(transaction.value);
      } else if (transaction.launchType === 'expense') {
        totalDebits += Math.abs(transaction.value);
      }

      // Update final balance with the last transaction balance
      if (transaction.balance !== undefined) {
        finalBalance = transaction.balance;
      }
    });

    return { totalCredits, totalDebits, finalBalance };
  }, [sortedAndFilteredTransactions]);

  const handleActionClick = useCallback(
    (transaction: TransactionGridTransaction) => {
      if (onActionClick) {
        onActionClick(transaction);
      } else {
        navigate(`/transactions/edit/${transaction.id}`);
      }
    },
    [onActionClick, navigate],
  );

  const headerProps = {
    sortConfig,
    filters,
    activeFilter,
    onSort: toggleSort,
    onFilterClick: handleFilterClick,
    onFilter: handleFilter,
    onCloseFilter: () => setActiveFilter(null),
    getFieldValues,
    transactions,
  };

  const hasItems = paginatedItems.length > 0;

  return (
    <Card
      className={cn(
        'bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm',
        className,
      )}
    >
      <div className="p-3 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando transações...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="w-full min-h-[320px]">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[6%] sm:w-[8%]" />
                    <col className="w-[12%] sm:w-[15%]" />
                    <col className="w-[20%] sm:w-[25%]" />
                    <col className="w-[12%] sm:w-[15%]" />
                    <col className="w-[12%] text-right" />
                    <col className="w-[12%] text-right" />
                    <col className="w-[12%] text-right" />
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
                      <SortableHeader
                        field="credit"
                        className="text-right pl-0 pr-8"
                        {...headerProps}
                      >
                        Crédito
                      </SortableHeader>
                      <SortableHeader
                        field="debit"
                        className="text-right pl-0 pr-8"
                        {...headerProps}
                      >
                        Débito
                      </SortableHeader>
                      <SortableHeader
                        field="balance"
                        className="text-right pl-0 pr-8"
                        {...headerProps}
                      >
                        Saldo
                      </SortableHeader>
                      {showActions && (
                        <th className="w-24 text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">
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
                          onActionClick={handleActionClick}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={showActions ? 8 : 7}
                          className="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          Nenhuma transação encontrada para o período selecionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {sortedAndFilteredTransactions.length > 0 && (
                    <tfoot className="bg-background/50 dark:bg-background-dark/50 border-t-2 border-border dark:border-border-dark">
                      <tr>
                        <td className="py-2 px-4 text-xs font-semibold text-text dark:text-text-dark"></td>
                        <td className="py-2 px-4 text-xs font-semibold text-text dark:text-text-dark"></td>
                        <td className="py-2 px-4 text-xs font-semibold text-text dark:text-text-dark"></td>
                        <td className="py-2 px-4 text-xs font-semibold text-text dark:text-text-dark text-right">
                          TOTAL:
                        </td>
                        <td className="py-2 pl-0 pr-8 text-xs font-semibold text-green-500 dark:text-green-400 text-right whitespace-nowrap">
                          {formatCurrency(totals.totalCredits)}
                        </td>
                        <td className="py-2 pl-0 pr-8 text-xs font-semibold text-red-500 dark:text-red-400 text-right whitespace-nowrap">
                          -{formatCurrency(totals.totalDebits)}
                        </td>
                        <td
                          className={cn(
                            'py-2 pl-0 pr-8 text-xs font-semibold text-right whitespace-nowrap',
                            totals.finalBalance >= 0
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-red-500 dark:text-red-400',
                          )}
                        >
                          {totals.finalBalance >= 0 ? '+' : ''}
                          {formatCurrency(Math.abs(totals.finalBalance))}
                        </td>
                        {showActions && <td className="py-2 px-4"></td>}
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2 min-h-[320px]">
              {hasItems ? (
                paginatedItems.map((transaction) => (
                  <MobileCard
                    key={transaction.id}
                    transaction={transaction}
                    showActions={showActions}
                    onActionClick={handleActionClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="flex h-full items-center justify-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nenhuma transação encontrada para o período selecionado.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPageSelected}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        )}
      </div>
    </Card>
  );
}

// Re-export types for backward compatibility
export type { TransactionGridTransaction } from './TransactionGrid.types';
