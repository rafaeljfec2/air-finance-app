import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { StatementTransaction } from '@/services/bankingStatementService';
import type { UseStatementTransactionsParams } from './types';

export function useStatementTransactions({
  statementData,
  currentPage,
  accountId,
  month,
  categoryMap,
}: UseStatementTransactionsParams) {
  const [allTransactions, setAllTransactions] = useState<StatementTransaction[]>([]);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const contextKeyRef = useRef<string>(`${accountId}-${month}`);

  const resetTransactions = useCallback(() => {
    setAllTransactions([]);
    loadedPagesRef.current.clear();
  }, []);

  useEffect(() => {
    const currentContextKey = `${accountId}-${month}`;

    if (contextKeyRef.current !== currentContextKey) {
      contextKeyRef.current = currentContextKey;
      resetTransactions();
    }
  }, [accountId, month, resetTransactions]);

  useEffect(() => {
    if (!statementData?.transactions) {
      return;
    }

    const statementPage = statementData.page ?? currentPage;
    const pageNumber =
      typeof statementPage === 'string' ? Number.parseInt(statementPage, 10) : statementPage;

    if (loadedPagesRef.current.has(pageNumber)) {
      return;
    }

    const pageTransactions = statementData.transactions;

    if (pageTransactions.length === 0) {
      return;
    }

    loadedPagesRef.current.add(pageNumber);

    if (pageNumber === 1) {
      setAllTransactions(pageTransactions);
    } else {
      setAllTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTransactions = pageTransactions.filter((t) => !existingIds.has(t.id));
        const merged = [...prev, ...newTransactions];
        return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    }
  }, [statementData, currentPage]);

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
}
