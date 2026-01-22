import type {
  BalanceHistoryPoint,
  DashboardComparison,
  DashboardFilters,
  DashboardGoalSummary,
  DashboardSummary,
  DashboardTimeRange,
  ExpenseByCategory,
} from '@/types/dashboard';
import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';
import { TransactionSchema, type Transaction } from './transactionService';

const DashboardSummarySchema = z.object({
  income: z.number(),
  expenses: z.number(),
  balance: z.number(),
  previousIncome: z.number().nullable(),
  previousExpenses: z.number().nullable(),
  previousBalance: z.number().nullable(),
  accumulatedBalance: z.number().nullable(),
  incomeChangePct: z.number().nullable(),
  expensesChangePct: z.number().nullable(),
  balanceChangePct: z.number().nullable(),
  periodStart: z.string(),
  periodEnd: z.string(),
});

const BalanceHistoryPointSchema = z.object({
  date: z.string(),
  balance: z.number(),
  income: z.number(),
  expenses: z.number(),
});

const ExpenseByCategorySchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  color: z.string(),
  value: z.number(),
});

const ComparisonPeriodSchema = z.object({
  income: z.number(),
  expenses: z.number(),
  savings: z.number(),
});

const DashboardComparisonSchema = z.object({
  current: ComparisonPeriodSchema,
  previous: ComparisonPeriodSchema,
});

const DashboardGoalSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  progressPct: z.number(),
  deadline: z.string(),
});

export const DASHBOARD_TIME_RANGES: DashboardTimeRange[] = [
  'day',
  'week',
  'month',
  '6months',
  'year',
];

function buildParams(filters: DashboardFilters) {
  const params: Record<string, string> = {
    timeRange: filters.timeRange,
  };

  if (filters.referenceDate) {
    params.referenceDate = filters.referenceDate;
  }

  return params;
}

async function fetchDashboardSummary(
  companyId: string,
  filters: DashboardFilters,
): Promise<DashboardSummary> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/summary`, {
      params: buildParams(filters),
    });

    return DashboardSummarySchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchBalanceHistory(
  companyId: string,
  filters: DashboardFilters,
): Promise<BalanceHistoryPoint[]> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/balance-history`, {
      params: buildParams(filters),
    });

    return z.array(BalanceHistoryPointSchema).parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchExpensesByCategory(
  companyId: string,
  filters: DashboardFilters,
): Promise<ExpenseByCategory[]> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/expenses-by-category`, {
      params: buildParams(filters),
    });

    return z.array(ExpenseByCategorySchema).parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchComparison(
  companyId: string,
  filters: DashboardFilters,
): Promise<DashboardComparison> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/comparison`, {
      params: buildParams(filters),
    });

    return DashboardComparisonSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchGoalsSummary(companyId: string, limit = 3): Promise<DashboardGoalSummary[]> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/goals-summary`, {
      params: { limit },
    });

    return z.array(DashboardGoalSummarySchema).parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchRecentTransactions(
  companyId: string,
  filters: DashboardFilters,
  limit = 10,
): Promise<Transaction[]> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/recent-transactions`, {
      params: {
        ...buildParams(filters),
        limit,
      },
    });

    return TransactionSchema.array().parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchExtractsSummary(
  companyId: string,
  filters: DashboardFilters,
): Promise<DashboardSummary> {
  try {
    const response = await apiClient.get(`/companies/${companyId}/dashboard/extracts-summary`, {
      params: buildParams(filters),
    });

    return DashboardSummarySchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

export const dashboardService = {
  fetchDashboardSummary,
  fetchBalanceHistory,
  fetchExpensesByCategory,
  fetchComparison,
  fetchGoalsSummary,
  fetchRecentTransactions,
  fetchExtractsSummary,
};
