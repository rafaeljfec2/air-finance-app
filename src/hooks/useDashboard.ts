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
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
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
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
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
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
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
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

export const useDashboardGoalsSummary = (companyId: string, limit = 3) =>
  useQuery<DashboardGoalSummary[]>({
    queryKey: ['dashboard', 'goals-summary', companyId, limit],
    queryFn: () => dashboardService.fetchGoalsSummary(companyId, limit),
    enabled: !!companyId,
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
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
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
