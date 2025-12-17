import { dashboardService } from '@/services/dashboardService';
import type { Transaction } from '@/services/transactionService';
import type {
  BalanceHistoryPoint,
  DashboardComparison,
  DashboardFilters,
  DashboardGoalSummary,
  DashboardSummary,
  ExpenseByCategory,
} from '@/types/dashboard';
import { useQuery } from '@tanstack/react-query';

export const useDashboardSummary = (companyId: string, filters: DashboardFilters) =>
  useQuery<DashboardSummary>({
    queryKey: ['dashboard', 'summary', companyId, filters.timeRange, filters.referenceDate ?? null],
    queryFn: () => dashboardService.fetchDashboardSummary(companyId, filters),
    enabled: !!companyId,
  });

export const useDashboardBalanceHistory = (companyId: string, filters: DashboardFilters) =>
  useQuery<BalanceHistoryPoint[]>({
    queryKey: [
      'dashboard',
      'balance-history',
      companyId,
      filters.timeRange,
      filters.referenceDate ?? null,
    ],
    queryFn: () => dashboardService.fetchBalanceHistory(companyId, filters),
    enabled: !!companyId,
  });

export const useDashboardExpensesByCategory = (companyId: string, filters: DashboardFilters) =>
  useQuery<ExpenseByCategory[]>({
    queryKey: [
      'dashboard',
      'expenses-by-category',
      companyId,
      filters.timeRange,
      filters.referenceDate ?? null,
    ],
    queryFn: () => dashboardService.fetchExpensesByCategory(companyId, filters),
    enabled: !!companyId,
  });

export const useDashboardComparison = (companyId: string, filters: DashboardFilters) =>
  useQuery<DashboardComparison>({
    queryKey: [
      'dashboard',
      'comparison',
      companyId,
      filters.timeRange,
      filters.referenceDate ?? null,
    ],
    queryFn: () => dashboardService.fetchComparison(companyId, filters),
    enabled: !!companyId,
  });

export const useDashboardGoalsSummary = (companyId: string, limit = 3) =>
  useQuery<DashboardGoalSummary[]>({
    queryKey: ['dashboard', 'goals-summary', companyId, limit],
    queryFn: () => dashboardService.fetchGoalsSummary(companyId, limit),
    enabled: !!companyId,
  });

export const useDashboardRecentTransactions = (
  companyId: string,
  filters: DashboardFilters,
  limit = 10,
) =>
  useQuery<Transaction[]>({
    queryKey: [
      'dashboard',
      'recent-transactions',
      companyId,
      filters.timeRange,
      filters.referenceDate ?? null,
      limit,
    ],
    queryFn: () => dashboardService.fetchRecentTransactions(companyId, filters, limit),
    enabled: !!companyId,
  });
