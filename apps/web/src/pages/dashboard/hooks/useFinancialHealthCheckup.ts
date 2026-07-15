import { useMemo } from 'react';

import {
  useDashboardBalanceHistory,
  useDashboardExpensesByCategory,
  useDashboardSummary,
} from '@/hooks/useDashboard';
import { useIndebtedness } from '@/hooks/useIndebtedness';
import type { DashboardFilters } from '@/types/dashboard';

import { mapLiveMetricsToPillars } from '../mappers/mapLiveMetricsToPillars';
import type { FinancialHealthCheckup } from '../types';

interface UseFinancialHealthCheckupResult {
  readonly checkup: FinancialHealthCheckup | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isPartial: boolean;
  readonly refetch: () => Promise<void>;
  readonly summary: ReturnType<typeof useDashboardSummary>;
  readonly balanceHistory: ReturnType<typeof useDashboardBalanceHistory>;
  readonly expensesByCategory: ReturnType<typeof useDashboardExpensesByCategory>;
  readonly indebtedness: ReturnType<typeof useIndebtedness>;
}

export function useFinancialHealthCheckup(
  companyId: string,
  filters: DashboardFilters,
): UseFinancialHealthCheckupResult {
  const summaryQuery = useDashboardSummary(companyId, filters);
  const indebtednessQuery = useIndebtedness(companyId);
  const balanceHistoryQuery = useDashboardBalanceHistory(companyId, filters);
  const expensesQuery = useDashboardExpensesByCategory(companyId, filters);

  const checkup = useMemo(() => {
    if (!companyId) {
      return null;
    }
    if (summaryQuery.isLoading || indebtednessQuery.isLoading) {
      return null;
    }
    return mapLiveMetricsToPillars({
      summary: summaryQuery.data,
      indebtedness: indebtednessQuery.data,
    });
  }, [
    companyId,
    summaryQuery.isLoading,
    indebtednessQuery.isLoading,
    summaryQuery.data,
    indebtednessQuery.data,
  ]);

  const isPartial =
    checkup !== null && checkup.pillars.some((pillar) => pillar.state === 'inconclusive');

  const refetch = async () => {
    await Promise.all([
      summaryQuery.refetch(),
      indebtednessQuery.refetch(),
      balanceHistoryQuery.refetch(),
      expensesQuery.refetch(),
    ]);
  };

  return {
    checkup,
    isLoading:
      !!companyId &&
      (summaryQuery.isLoading ||
        indebtednessQuery.isLoading ||
        balanceHistoryQuery.isLoading ||
        expensesQuery.isLoading),
    isError:
      summaryQuery.isError ||
      indebtednessQuery.isError ||
      balanceHistoryQuery.isError ||
      expensesQuery.isError,
    isPartial,
    refetch,
    summary: summaryQuery,
    balanceHistory: balanceHistoryQuery,
    expensesByCategory: expensesQuery,
    indebtedness: indebtednessQuery,
  };
}
