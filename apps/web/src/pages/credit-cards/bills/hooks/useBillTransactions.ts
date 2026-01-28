import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { processExtractTransactions, type BillTransaction } from './utils/transactionProcessing';
import type { CreditCardBillResponse } from '@/services/creditCardService';

interface UseBillTransactionsParams {
  readonly billData: CreditCardBillResponse | undefined;
  readonly currentPage: number;
  readonly cardId: string;
  readonly month: string;
  readonly categoryMap?: Map<string, string>;
  readonly searchTerm?: string;
}

export const useBillTransactions = ({
  billData,
  currentPage,
  cardId,
  month,
  categoryMap,
  searchTerm,
}: UseBillTransactionsParams) => {
  const [allTransactions, setAllTransactions] = useState<BillTransaction[]>([]);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const contextKeyRef = useRef<string>(`${cardId}-${month}-${searchTerm ?? ''}`);

  const resetTransactions = useCallback(() => {
    setAllTransactions([]);
    loadedPagesRef.current.clear();
  }, []);

  useEffect(() => {
    const currentContextKey = `${cardId}-${month}-${searchTerm ?? ''}`;

    if (contextKeyRef.current !== currentContextKey) {
      contextKeyRef.current = currentContextKey;
      resetTransactions();
    }
  }, [cardId, month, searchTerm, resetTransactions]);

  useEffect(() => {
    if (!billData?.data?.transactions) {
      return;
    }

    const billPage = billData.pagination?.page ?? currentPage;
    const pageNumber = typeof billPage === 'string' ? Number.parseInt(billPage, 10) : billPage;

    if (loadedPagesRef.current.has(pageNumber)) {
      return;
    }

    const pageTransactions = processExtractTransactions(billData.data.transactions);

    loadedPagesRef.current.add(pageNumber);

    if (pageNumber === 1) {
      setAllTransactions(pageTransactions);
    } else {
      if (pageTransactions.length === 0) {
        return;
      }
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
