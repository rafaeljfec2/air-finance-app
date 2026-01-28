import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { processExtractTransactions, type BillTransaction } from './utils/transactionProcessing';
import type { CreditCardBillResponse } from '@/services/creditCardService';

interface UseBillTransactionsParams {
  readonly billData: CreditCardBillResponse | undefined;
  readonly currentPage: number;
  readonly cardId: string;
  readonly month: string;
  readonly categoryMap?: Map<string, string>;
}

export const useBillTransactions = ({
  billData,
  currentPage,
  cardId,
  month,
  categoryMap,
}: UseBillTransactionsParams) => {
  const [allTransactions, setAllTransactions] = useState<BillTransaction[]>([]);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const contextKeyRef = useRef<string>(`${cardId}-${month}`);

  // Reset when card or month changes
  const resetTransactions = useCallback(() => {
    setAllTransactions([]);
    loadedPagesRef.current.clear();
  }, []);

  useEffect(() => {
    const currentContextKey = `${cardId}-${month}`;

    // Reset if context changed (different card or month)
    if (contextKeyRef.current !== currentContextKey) {
      contextKeyRef.current = currentContextKey;
      resetTransactions();
    }
  }, [cardId, month, resetTransactions]);

  useEffect(() => {
    if (!billData?.data?.transactions) {
      return;
    }

    const billPage = billData.pagination?.page ?? currentPage;
    const pageNumber = typeof billPage === 'string' ? Number.parseInt(billPage, 10) : billPage;

    // Skip if this page was already loaded
    if (loadedPagesRef.current.has(pageNumber)) {
      return;
    }

    const pageTransactions = processExtractTransactions(billData.data.transactions);

    if (pageTransactions.length === 0) {
      return;
    }

    // Mark page as loaded
    loadedPagesRef.current.add(pageNumber);

    if (pageNumber === 1) {
      // First page: replace all transactions
      setAllTransactions(pageTransactions);
    } else {
      // Subsequent pages: accumulate transactions
      setAllTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTransactions = pageTransactions.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newTransactions];
      });
    }
  }, [billData, currentPage]);

  const transactionsWithCategories = useMemo(() => {
    if (!categoryMap || categoryMap.size === 0) {
      return allTransactions;
    }
    return allTransactions.map((tx) => ({
      ...tx,
      category: tx.categoryId ? categoryMap.get(tx.categoryId) : undefined,
    }));
  }, [allTransactions, categoryMap]);

  return {
    allTransactions: transactionsWithCategories,
  };
};
