import { useQuery } from '@tanstack/react-query';

import { getCreditCardTransactions } from '@/services/openiService';

import type { StatementPeriodRange } from '../mappers/getStatementPeriodRange';
import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';
import { mapOpeniTransactionsToStatementItems } from '../mappers/mapOpeniTransactionToStatementItem';
import type { StatementTransactionItem } from '../mappers/mapOpeniTransactionToStatementItem';
import { toOpeniIsoDateTimeRange } from '../mappers/toOpeniIsoDateTimeRange';

export interface UseOpenFinanceCardStatementParams {
  readonly companyId: string;
  readonly card: OpenFinanceCreditCard | null;
  readonly period: StatementPeriodRange;
}

export interface UseOpenFinanceCardStatementResult {
  readonly transactions: StatementTransactionItem[];
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly error: Error | null;
  readonly refetch: () => void;
}

export function useOpenFinanceCardStatement({
  companyId,
  card,
  period,
}: UseOpenFinanceCardStatementParams): UseOpenFinanceCardStatementResult {
  const enabled = Boolean(companyId && card?.id && card.itemId && card.openiCardId);

  const query = useQuery({
    queryKey: [
      'openi-credit-card-statement',
      companyId,
      card?.id,
      card?.openiCardId,
      period.startDate,
      period.endDate,
    ],
    queryFn: async () => {
      if (!card) {
        return [];
      }
      const payload = await getCreditCardTransactions(
        companyId,
        card.itemId,
        card.openiCardId,
        card.id,
        toOpeniIsoDateTimeRange(period.startDate, period.endDate),
      );
      return mapOpeniTransactionsToStatementItems(payload.transactions);
    },
    enabled,
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
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
