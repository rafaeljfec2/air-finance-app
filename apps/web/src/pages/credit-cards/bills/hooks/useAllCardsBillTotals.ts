import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getCreditCardBill, type CreditCard } from '@/services/creditCardService';

interface UseAllCardsBillTotalsParams {
  readonly companyId: string;
  readonly creditCards: ReadonlyArray<CreditCard>;
  readonly month: string;
}

export function useAllCardsBillTotals({
  companyId,
  creditCards,
  month,
}: UseAllCardsBillTotalsParams) {
  const queries = useQueries({
    queries: creditCards.map((card) => ({
      queryKey: ['credit-card-bill-total', companyId, card.id, month],
      queryFn: () => getCreditCardBill(companyId, card.id, month, { page: 1, limit: 1 }),
      enabled: !!companyId && !!card.id && !!month,
      staleTime: 30000,
    })),
  });

  const cardLimitsUsed = useMemo(() => {
    const limits: Record<string, number> = {};
    queries.forEach((query, index) => {
      if (query.data?.pagination?.totalAmount !== undefined) {
        limits[creditCards[index].id] = query.data.pagination.totalAmount;
      }
    });
    return limits;
  }, [queries, creditCards]);

  const aggregated = useMemo(() => {
    let totalLimit = 0;
    let totalUsed = 0;

    creditCards.forEach((card) => {
      totalLimit += card.limit;
      totalUsed += cardLimitsUsed[card.id] ?? 0;
    });

    return {
      totalLimit,
      totalUsed,
      totalAvailable: totalLimit - totalUsed,
    };
  }, [creditCards, cardLimitsUsed]);

  const isLoading = queries.some((q) => q.isLoading);
  const isFetching = queries.some((q) => q.isFetching);

  return {
    cardLimitsUsed,
    aggregated,
    isLoading,
    isFetching,
  };
}
