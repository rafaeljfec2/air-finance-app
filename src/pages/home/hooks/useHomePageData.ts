import {
  useDashboardBalanceHistory,
  useDashboardRecentTransactions,
  useDashboardSummary,
} from '@/hooks/useDashboard';
import { useCompanyStore } from '@/stores/company';
import { useMemo } from 'react';
import type { DashboardFilters } from '@/types/dashboard';

export function useHomePageData() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: new Date().toISOString(),
    }),
    [],
  );

  const balanceQuery = useDashboardBalanceHistory(companyId, filters);
  const transactionsQuery = useDashboardRecentTransactions(companyId, filters, 5);
  const summaryQuery = useDashboardSummary(companyId, filters);

  const balance =
    balanceQuery.data && balanceQuery.data.length > 0
      ? balanceQuery.data.at(-1)?.balance ?? 0
      : 0;

  const income = summaryQuery.data?.income ?? 0;
  const expenses = summaryQuery.data?.expenses ?? 0;

  const total = income + expenses;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;

  return {
    balance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    total,
    isLoading: summaryQuery.isLoading || balanceQuery.isLoading || transactionsQuery.isLoading,
    transactions: transactionsQuery.data ?? [],
    summaryQuery,
  };
}
