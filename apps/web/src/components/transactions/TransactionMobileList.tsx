import type { TransactionGridTransaction } from './TransactionGrid.types';
import { EmptyState } from './EmptyState';
import { MobileCard } from './TransactionMobileCard';

interface TransactionMobileListProps {
  readonly paginatedItems: TransactionGridTransaction[];
  readonly showActions: boolean;
  readonly onActionClick: (transaction: TransactionGridTransaction) => void;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

export function TransactionMobileList({
  paginatedItems,
  showActions,
  onActionClick,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
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
            onRetryPayment={onRetryPayment}
          />
        ))
      ) : (
        <EmptyState variant="mobile" />
      )}
    </div>
  );
}
