import { useQuery } from '@tanstack/react-query';
import { budgetService, type BudgetFilters, type BudgetResponse } from '@/services/budgetService';

export const useBudget = (companyId: string | null, filters: BudgetFilters) => {
  const enabled = Boolean(companyId);

  return useQuery<BudgetResponse>({
    queryKey: ['budget', companyId, filters.year, filters.month],
    queryFn: () => budgetService.getBudget(companyId as string, filters),
    enabled,
  });
};


