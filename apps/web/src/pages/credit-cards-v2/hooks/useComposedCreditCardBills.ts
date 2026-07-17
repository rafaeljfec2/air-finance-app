import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { budgetService } from '@/services/budgetService';
import type { CreditCard, CreditCardSourceState } from '@/types/budget';

export interface ComposedCreditCardBill {
  readonly accountId: string;
  readonly total: number;
  readonly sourceState?: CreditCardSourceState;
}

export interface UseComposedCreditCardBillsResult {
  readonly composedByAccountId: ReadonlyMap<string, ComposedCreditCardBill>;
  readonly isLoading: boolean;
}

function resolveCurrentBudgetFilters(referenceDate: Date) {
  return {
    year: String(referenceDate.getFullYear()),
    month: String(referenceDate.getMonth() + 1).padStart(2, '0'),
  };
}

function toComposedBill(card: CreditCard): ComposedCreditCardBill | null {
  const openBill = card.bills.find((bill) => bill.status === 'OPEN') ?? card.bills[0];
  if (!openBill) {
    return null;
  }

  return {
    accountId: card.accountId,
    total: openBill.total,
    sourceState: card.sourceState,
  };
}

export function useComposedCreditCardBills(
  companyId: string,
  referenceDate: Date,
): UseComposedCreditCardBillsResult {
  const filters = resolveCurrentBudgetFilters(referenceDate);

  const query = useQuery({
    queryKey: ['budget', 'credit-cards', 'composed', companyId, filters.year, filters.month],
    queryFn: () => budgetService.getCreditCards(companyId, filters),
    enabled: Boolean(companyId),
    staleTime: 60 * 1000,
  });

  const composedByAccountId = useMemo(() => {
    const map = new Map<string, ComposedCreditCardBill>();
    for (const card of query.data ?? []) {
      const composed = toComposedBill(card);
      if (composed) {
        map.set(card.accountId, composed);
      }
    }
    return map;
  }, [query.data]);

  return {
    composedByAccountId,
    isLoading: query.isLoading,
  };
}
