import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2, Receipt } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from './hooks/usePagination';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useTransactionSorting } from './hooks/useTransactionSorting';
import { PaginationControls } from './PaginationControls';
import { SortableHeader } from './SortableHeader';
import type {
    FilterValue,
    SortDirection,
    SortField,
    TransactionGridProps,
    TransactionGridTransaction,
} from './TransactionGrid.types';
import { calculateBalance, getFieldValues } from './TransactionGrid.utils';
import { MobileCard } from './TransactionMobileCard';
import { TableRow } from './TransactionTableRow';

export function TransactionGrid({
  transactions,
  isLoading = false,
  showActions = true,
  onActionClick,
  onEdit,
  onDelete,
  onViewHistory,
  className,
  resetPageKey,
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
    resetPage,
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

  // Track resetPageKey to detect when page should be reset (e.g., account filter change)
  const previousResetPageKeyRef = useRef<string | number | undefined>(resetPageKey);
  const isInitialMountRef = useRef(true);

  // Reset page to 1 when resetPageKey changes
  useEffect(() => {
    // Skip reset on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousResetPageKeyRef.current = resetPageKey;
      return;
    }

    // Reset if resetPageKey changed (including undefined changes)
    if (previousResetPageKeyRef.current !== resetPageKey) {
      resetPage();
    }
    previousResetPageKeyRef.current = resetPageKey;
  }, [resetPageKey, resetPage]);

  const sortedAndFilteredTransactions = useMemo(() => {
    const filtered = getFilteredTransactions(transactionsWithBalance);
    return sortTransactions(filtered);
  }, [getFilteredTransactions, sortTransactions, transactionsWithBalance]);

  const { paginatedItems, totalPages, startIndex, endIndex, totalItems } = useMemo(
    () => paginate(sortedAndFilteredTransactions),
    [paginate, sortedAndFilteredTransactions],
  );

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
                          onViewHistory={onViewHistory}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={showActions ? 8 : 7}
                          className="py-16 text-center"
                        >
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="p-4 bg-muted/50 rounded-full">
                              <Receipt className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="font-medium text-text dark:text-text-dark">Nenhuma transação encontrada</p>
                              <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou busque por outro termo.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
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
                    onViewHistory={onViewHistory}
                  />
                ))
              ) : (
                <div className="flex flex-col h-full items-center justify-center py-12 px-4 gap-3 text-center bg-muted/10 rounded-lg border border-border/50 border-dashed">
                   <div className="p-3 bg-muted/50 rounded-full">
                      <Receipt className="h-6 w-6 text-muted-foreground/50" />
                   </div>
                   <div className="flex flex-col gap-1">
                      <p className="font-medium text-text dark:text-text-dark">Nenhuma transação</p>
                      <p className="text-sm text-muted-foreground">Não encontramos nada com os filtros atuais.</p>
                   </div>
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
