import { useEffect, useRef, useMemo } from 'react';
import { BillTransactionItem } from './BillTransactionItem';

interface BillTransactionListProps {
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    category?: string;
  }>;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
}

export function BillTransactionList({
  transactions,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: Readonly<BillTransactionListProps>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isLoadingRef.current = isLoadingMore;
  }, [isLoadingMore]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;

    if (!hasMore || isLoadingMore || !currentRef) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoadingRef.current) {
          isLoadingRef.current = true;
          onLoadMore()
            .catch((error) => {
              console.error('Error in loadMore:', error);
            })
            .finally(() => {
              isLoadingRef.current = false;
            });
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.01,
      },
    );

    observer.observe(currentRef);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, typeof transactions> = {};
    transactions.forEach((transaction) => {
      const dateKey = transaction.date.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  }, [transactions]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedTransactions]);

  if (transactions.length === 0) {
    return (
      <div className="bg-card dark:bg-card-dark px-4 py-12 text-center">
        <p className="text-sm text-text/60 dark:text-text-dark/60">
          Nenhuma transação encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card dark:bg-card-dark">
      {sortedDates.map((dateKey) => {
        const dateTransactions = groupedTransactions[dateKey];
        return dateTransactions.map((transaction, index) => (
          <BillTransactionItem
            key={transaction.id}
            transaction={transaction}
            showDateHeader={index === 0}
          />
        ));
      })}

      {isLoadingMore && (
        <div className="sticky bottom-0 z-10 bg-card dark:bg-card-dark border-t border-border dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-center gap-2 py-4 px-4">
            <div className="animate-spin rounded-full border-2 border-border dark:border-border-dark border-t-primary-500 h-4 w-4" />
            <span className="text-sm text-text/70 dark:text-text-dark/70 font-medium">
              Carregando mais transações...
            </span>
          </div>
        </div>
      )}

      {hasMore && !isLoadingMore && (
        <div
          ref={loadMoreRef}
          className="h-32 flex items-center justify-center bg-card dark:bg-card-dark"
          aria-label="Carregar mais"
        >
          <div className="h-1 w-full" />
        </div>
      )}
    </div>
  );
}
