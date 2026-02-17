import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { PaginationControls } from './PaginationControls';
import type { TransactionGridProps } from './TransactionGrid.types';
import { TransactionTable } from './TransactionTable';
import { TransactionMobileList } from './TransactionMobileList';
import { useTransactionGridState } from './hooks/useTransactionGridState';
import './TransactionGrid.css';

export function TransactionGrid({
  transactions,
  isLoading = false,
  showActions = true,
  onActionClick,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
  className,
  resetPageKey,
  spacious = false,
}: Readonly<TransactionGridProps>) {
  const {
    sortConfig,
    activeFilter,
    filters,
    currentPage,
    itemsPerPageSelected,
    paginatedItems,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handleFilterClick,
    handleFilter,
    toggleSort,
    handleActionClick,
    handlePageChange,
    handleItemsPerPageChange,
    setActiveFilter,
  } = useTransactionGridState({
    transactions,
    resetPageKey,
    onActionClick,
  });

  return (
    <Card
      className={cn(
        'bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm',
        className,
      )}
    >
      <div className="p-2 sm:p-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando transações...</p>
          </div>
        ) : (
          <>
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

            <TransactionTable
              transactions={transactions}
              paginatedItems={paginatedItems}
              showActions={showActions}
              spacious={spacious}
              sortConfig={sortConfig}
              filters={filters}
              activeFilter={activeFilter}
              onSort={toggleSort}
              onFilterClick={handleFilterClick}
              onFilter={handleFilter}
              onCloseFilter={() => setActiveFilter(null)}
              onActionClick={handleActionClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewHistory={onViewHistory}
              onRetryPayment={onRetryPayment}
            />

            <TransactionMobileList
              paginatedItems={paginatedItems}
              showActions={showActions}
              onActionClick={handleActionClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewHistory={onViewHistory}
              onRetryPayment={onRetryPayment}
            />
          </>
        )}
      </div>
    </Card>
  );
}

// Re-export types for backward compatibility
export type { TransactionGridTransaction } from './TransactionGrid.types';
