import { useCallback } from 'react';
import type {
  TransactionGridTransaction,
  SortField,
  SortDirection,
} from '../TransactionGrid.types';

export function useTransactionSorting(sortConfig: { field: SortField; direction: SortDirection }) {
  const sortByDate = useCallback(
    (a: TransactionGridTransaction, b: TransactionGridTransaction, direction: SortDirection) => {
      try {
        const dateA = new Date(a.paymentDate || a.createdAt).getTime();
        const dateB = new Date(b.paymentDate || b.createdAt).getTime();
        if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
          return 0;
        }
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      } catch (error) {
        console.error('Error sorting dates:', error);
        return 0;
      }
    },
    [],
  );

  const sortByString = useCallback((a: string, b: string, direction: SortDirection) => {
    return direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  }, []);

  const sortByNumber = useCallback((a: number, b: number, direction: SortDirection) => {
    return direction === 'asc' ? a - b : b - a;
  }, []);

  const sortTransactions = useCallback(
    (transactions: TransactionGridTransaction[]) => {
      return [...transactions].sort((a, b) => {
        switch (sortConfig.field) {
          case 'date':
            return sortByDate(a, b, sortConfig.direction);
          case 'category':
            return sortByString(
              a.categoryId || 'Sem categoria',
              b.categoryId || 'Sem categoria',
              sortConfig.direction,
            );
          case 'description':
            return sortByString(
              a.description || 'Sem descrição',
              b.description || 'Sem descrição',
              sortConfig.direction,
            );
          case 'account':
            return sortByString(
              a.accountId || 'Sem conta',
              b.accountId || 'Sem conta',
              sortConfig.direction,
            );
          case 'credit': {
            const aValue = a.launchType === 'revenue' ? a.value : 0;
            const bValue = b.launchType === 'revenue' ? b.value : 0;
            return sortByNumber(aValue, bValue, sortConfig.direction);
          }
          case 'debit': {
            const aValue = a.launchType === 'expense' ? a.value : 0;
            const bValue = b.launchType === 'expense' ? b.value : 0;
            return sortByNumber(aValue, bValue, sortConfig.direction);
          }
          case 'balance': {
            const aValue = a.balance ?? 0;
            const bValue = b.balance ?? 0;
            return sortByNumber(aValue, bValue, sortConfig.direction);
          }
          default:
            return 0;
        }
      });
    },
    [sortConfig, sortByDate, sortByString, sortByNumber],
  );

  return { sortTransactions };
}
