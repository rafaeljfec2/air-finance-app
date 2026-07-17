import { useQuery } from '@tanstack/react-query';

import { getTransactions, type Transaction } from '@/services/transactionService';

/**
 * Fetches every transaction registered between `startDate` and `endDate`
 * (inclusive, `YYYY-MM-DD`). Used by the bills calendar (month window) and the
 * quick analysis (rolling 30-day window).
 */
export function useTransactionsRange(companyId: string, startDate: string, endDate: string) {
  return useQuery<Transaction[]>({
    queryKey: ['credit-cards-v2', 'transactions-range', companyId, startDate, endDate],
    queryFn: () => getTransactions(companyId, { startDate, endDate }),
    enabled: !!companyId && !!startDate && !!endDate,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
