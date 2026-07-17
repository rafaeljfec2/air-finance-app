import { useQuery } from '@tanstack/react-query';

import { getTransactions, type Transaction } from '@/services/transactionService';

/**
 * Fetches every transaction registered on a single day (all accounts, cards
 * included). Filtering of expenses and grouping happen in the consumer so the
 * raw daily list can be reused. `date` must be a `YYYY-MM-DD` string.
 */
export function useDayExpenses(companyId: string, date: string | null) {
  return useQuery<Transaction[]>({
    queryKey: ['dashboard', 'day-expenses', companyId, date],
    queryFn: () =>
      date ? getTransactions(companyId, { startDate: date, endDate: date }) : Promise.resolve([]),
    enabled: !!companyId && !!date,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
