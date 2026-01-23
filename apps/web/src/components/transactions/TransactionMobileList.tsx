import type { TransactionGridTransaction } from './TransactionGrid.types';
import { EmptyState } from './EmptyState';
import { MobileCard } from './TransactionMobileCard';

interface TransactionMobileListProps {
  paginatedItems: TransactionGridTransaction[];
  showActions: boolean;
  onActionClick: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
  onViewHistory?: (transaction: TransactionGridTransaction) => void;
}

export function TransactionMobileList({
  paginatedItems,
  showActions,
  onActionClick,
  onEdit,
  onDelete,
  onViewHistory,
}: Readonly<TransactionMobileListProps>) {
  const hasItems = paginatedItems.length > 0;

  return (
    <div className="md:hidden space-y-2 min-h-[320px]">
      {hasItems ? (
        paginatedItems.map((transaction) => (
          <MobileCard
            key={transaction.id}
            transaction={transaction}
            showActions={showActions}
            onActionClick={onActionClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewHistory={onViewHistory}
          />
        ))
      ) : (
        <EmptyState variant="mobile" />
      )}
    </div>
  );
}
