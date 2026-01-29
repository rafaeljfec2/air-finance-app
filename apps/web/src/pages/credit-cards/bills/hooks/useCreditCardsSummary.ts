import { useQuery } from '@tanstack/react-query';
import { getCreditCardsSummary, type CreditCardsSummary } from '@/services/creditCardService';

export function useCreditCardsSummary(companyId: string) {
  const { data, isLoading, error, isFetching } = useQuery<CreditCardsSummary>({
    queryKey: ['credit-cards-summary', companyId],
    queryFn: () => getCreditCardsSummary(companyId),
    enabled: !!companyId,
    staleTime: 30000,
  });

  const cardLimitsUsed: Record<string, number> = {};
  if (data?.creditCards) {
    for (const card of data.creditCards) {
      cardLimitsUsed[card.id] = card.totalUsed;
    }
  }

  return {
    summary: data,
    cardLimitsUsed,
    aggregated: data?.aggregated,
    isLoading,
    isFetching,
    error,
  };
}
