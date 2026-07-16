import { useQuery } from '@tanstack/react-query';

import { budgetService } from '@/services/budgetService';
import type { CashFlow } from '@/types/budget';

export function useYearlyCashFlow(
  companyId: string | null,
  year: string,
  options?: { readonly enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;

  return useQuery<CashFlow[]>({
    queryKey: ['yearly-cash-flow', companyId, year],
    queryFn: () => budgetService.getYearlyCashFlow(companyId as string, year),
    enabled: Boolean(companyId) && enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
