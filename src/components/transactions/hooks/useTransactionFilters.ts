import { useCallback } from 'react';
import type { TransactionGridTransaction, FilterValue } from '../TransactionGrid.types';
import { getFieldValue } from '../TransactionGrid.utils';

export function useTransactionFilters(filters: FilterValue[]) {
  const getFilteredTransactions = useCallback(
    (transactions: TransactionGridTransaction[]) => {
      return transactions.filter((transaction) => {
        return filters.every((filter) => {
          const value = getFieldValue(transaction, filter.field);
          return filter.values.has(value.toString());
        });
      });
    },
    [filters],
  );

  return { getFilteredTransactions };
}
