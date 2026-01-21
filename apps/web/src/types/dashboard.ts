export type DashboardTimeRange = 'day' | 'week' | 'month' | '6months' | 'year';

export interface DashboardSummary {
  income: number;
  expenses: number;
  balance: number;
  previousIncome: number | null;
  previousExpenses: number | null;
  previousBalance: number | null;
  accumulatedBalance: number | null;
  incomeChangePct: number | null;
  expensesChangePct: number | null;
  balanceChangePct: number | null;
  periodStart: string;
  periodEnd: string;
}

export interface BalanceHistoryPoint {
  date: string;
  balance: number;
  income: number;
  expenses: number;
}

export interface ExpenseByCategory {
  categoryId: string;
  name: string;
  color: string;
  value: number;
}

export interface DashboardComparisonPeriod {
  income: number;
  expenses: number;
  savings: number;
}

export interface DashboardComparison {
  current: DashboardComparisonPeriod;
  previous: DashboardComparisonPeriod;
}

export interface DashboardGoalSummary {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  progressPct: number;
  deadline: string;
}

export interface DashboardFilters {
  timeRange: DashboardTimeRange;
  referenceDate?: string;
}
