import { useQuery } from '@tanstack/react-query';

import { getCreditCard } from '@/services/openiService';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';
import {
  sortOpeniBillsByDueDateDesc,
  type OpenFinanceBillView,
} from '../mappers/mapOpeniBillsToView';

export interface UseOpenFinanceCardDetailsParams {
  readonly companyId: string;
  readonly card: OpenFinanceCreditCard | null;
}

export interface UseOpenFinanceCardDetailsResult {
  readonly bills: OpenFinanceBillView[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => void;
}

export function useOpenFinanceCardDetails({
  companyId,
  card,
}: UseOpenFinanceCardDetailsParams): UseOpenFinanceCardDetailsResult {
  const enabled = Boolean(companyId && card?.id && card.itemId && card.openiCardId);

  const query = useQuery({
    queryKey: ['openi-credit-card-details', companyId, card?.id, card?.openiCardId],
    queryFn: async () => {
      if (!card) {
        return [];
      }
      const details = await getCreditCard(companyId, card.itemId, card.openiCardId, card.id);
      return sortOpeniBillsByDueDateDesc(details.bills);
    },
    enabled,
  });

  return {
    bills: query.data ?? [],
    isLoading: query.isLoading,
    error:
      query.error instanceof Error
        ? query.error
        : query.error
          ? new Error(String(query.error))
          : null,
    refetch: () => {
      void query.refetch();
    },
  };
}
