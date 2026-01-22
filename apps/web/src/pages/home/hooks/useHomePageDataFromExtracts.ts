import { useDashboardExtractsSummary } from '@/hooks/useDashboard';
import { useCompanyStore } from '@/stores/company';
import { useMemo } from 'react';
import type { DashboardFilters } from '@/types/dashboard';

export function useHomePageDataFromExtracts() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: new Date().toISOString(),
    }),
    [],
  );

  const summaryQuery = useDashboardExtractsSummary(companyId, filters);

  const balance = summaryQuery.data?.balance ?? 0;
  const accumulatedBalance = summaryQuery.data?.accumulatedBalance ?? null;

  const income = summaryQuery.data?.income ?? 0;
  const expenses = summaryQuery.data?.expenses ?? 0;

  const total = income + expenses;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;

  return {
    balance,
    accumulatedBalance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    total,
    isLoading: summaryQuery.isLoading,
    transactions: [],
    summaryQuery,
  };
}
