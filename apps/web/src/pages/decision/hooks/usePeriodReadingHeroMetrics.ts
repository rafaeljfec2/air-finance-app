import { useQuery } from '@tanstack/react-query';

import { useDashboardSummary } from '@/hooks/useDashboard';
import { getTotalBalance } from '@/services/accountService';
import { budgetService } from '@/services/budgetService';

import {
  formatDueDatePt,
  pickNextPendingReceivable,
  type NextReceivableView,
} from '../mappers/pickNextPendingReceivable';

export interface PeriodReadingHeroMetrics {
  readonly balanceToday: number | null;
  readonly monthPlanBalance: number | null;
  readonly nextReceivable: NextReceivableView | null;
  readonly nextReceivableLabel: string | null;
  readonly isLoading: boolean;
  readonly isPartial: boolean;
}

function referenceDateFromPeriod(referencePeriod: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(referencePeriod.trim());
  if (!match) {
    return new Date().toISOString().slice(0, 10);
  }
  return `${match[1]}-${match[2]}-15`;
}

function budgetFiltersFromPeriod(referencePeriod: string): { year: string; month: string } {
  const match = /^(\d{4})-(\d{2})$/.exec(referencePeriod.trim());
  if (!match) {
    const now = new Date();
    return {
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1).padStart(2, '0'),
    };
  }
  return { year: match[1] ?? '', month: match[2] ?? '01' };
}

export function usePeriodReadingHeroMetrics(
  companyId: string,
  referencePeriod: string,
): PeriodReadingHeroMetrics {
  const enabled = companyId !== '' && referencePeriod.trim() !== '';
  const filters = budgetFiltersFromPeriod(referencePeriod);

  const balanceQuery = useQuery({
    queryKey: ['accounts', 'total-balance', companyId],
    queryFn: () => getTotalBalance(companyId),
    enabled,
    staleTime: 30_000,
  });

  const summaryQuery = useDashboardSummary(companyId, {
    timeRange: 'month',
    referenceDate: referenceDateFromPeriod(referencePeriod),
  });

  const receivablesQuery = useQuery({
    queryKey: ['budget', 'receivables', companyId, filters.year, filters.month],
    queryFn: () => budgetService.getReceivables(companyId, filters),
    enabled,
    staleTime: 30_000,
  });

  const nextReceivable = pickNextPendingReceivable(receivablesQuery.data ?? []);

  return {
    balanceToday: balanceQuery.data?.totalBalance ?? null,
    monthPlanBalance: summaryQuery.data?.balance ?? null,
    nextReceivable,
    nextReceivableLabel: nextReceivable != null ? formatDueDatePt(nextReceivable.dueDate) : null,
    isLoading: balanceQuery.isLoading || summaryQuery.isLoading || receivablesQuery.isLoading,
    isPartial: balanceQuery.isError || summaryQuery.isError || receivablesQuery.isError,
  };
}
