import { useEffect, useRef, useMemo } from 'react';
import { StatementTransactionItem } from './StatementTransactionItem';
import type { StatementTransaction } from '@/services/bankingStatementService';

interface StatementTransactionListProps {
  readonly transactions: ReadonlyArray<StatementTransaction>;
  readonly isLoadingMore: boolean;
  readonly hasMore: boolean;
  readonly onLoadMore: () => Promise<void>;
}

export function StatementTransactionList({
  transactions,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: Readonly<StatementTransactionListProps>) {
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

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoadingRef.current && !isLoadingMore) {
          isLoadingRef.current = true;
          observer.disconnect();
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
    type Transaction = (typeof transactions)[number];
    const grouped: Record<string, Transaction[]> = {};
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
      <div className="flex-1 flex items-center justify-center px-4 py-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {sortedDates.map((dateKey) => {
        const dateTransactions = groupedTransactions[dateKey];
        return dateTransactions.map((transaction, index) => (
          <StatementTransactionItem
            key={transaction.id}
            transaction={transaction}
            showDateHeader={index === 0}
          />
        ));
      })}

      {isLoadingMore && (
        <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-center gap-2 py-4 px-4">
            <div className="animate-spin rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-primary-500 h-4 w-4" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Carregando mais transações...
            </span>
          </div>
        </div>
      )}

      {hasMore && !isLoadingMore && (
        <div
          ref={loadMoreRef}
          className="h-32 flex items-center justify-center bg-transparent"
          aria-label="Carregar mais"
        >
          <div className="h-1 w-full" />
        </div>
      )}
    </div>
  );
}
