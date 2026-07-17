import { useQueries } from '@tanstack/react-query';

import { getCreditCard, type OpeniCreditCardDetailsPayload } from '@/services/openiService';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

export interface UseAllCardDetailsResult {
  readonly detailsByCardId: ReadonlyMap<string, OpeniCreditCardDetailsPayload>;
  readonly isLoading: boolean;
}

/**
 * Fetches Open Finance details (limits and bills) for every connected card so
 * the rail, KPI strip and upcoming bills can render consolidated data.
 */
export function useAllCardDetails(
  companyId: string,
  cards: ReadonlyArray<OpenFinanceCreditCard>,
): UseAllCardDetailsResult {
  return useQueries({
    queries: cards.map((card) => ({
      queryKey: ['openi-credit-card-details', companyId, card.id, card.openiCardId],
      queryFn: () => getCreditCard(companyId, card.itemId, card.openiCardId, card.id),
      enabled: Boolean(companyId && card.itemId && card.openiCardId),
      staleTime: 60 * 1000,
    })),
    combine: (results) => {
      const detailsByCardId = new Map<string, OpeniCreditCardDetailsPayload>();
      results.forEach((result, index) => {
        const card = cards[index];
        if (card && result.data) {
          detailsByCardId.set(card.id, result.data);
        }
      });
      return {
        detailsByCardId,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
