import type { BalanceHistoryPoint } from '@/types/dashboard';

export interface WeeklyRevenueExpense {
  readonly label: string;
  readonly income: number;
  readonly expenses: number;
}

/**
 * Aggregates daily balance-history points into calendar weeks of the month
 * (week 1 = days 1-7, week 2 = days 8-14, ...). Weeks without activity are skipped.
 */
export function aggregateWeeklyRevenueExpense(
  points: readonly BalanceHistoryPoint[],
): WeeklyRevenueExpense[] {
  const byWeek = new Map<number, { income: number; expenses: number }>();

  for (const point of points) {
    const day = new Date(point.date).getUTCDate();
    const week = Math.ceil(day / 7);
    const bucket = byWeek.get(week) ?? { income: 0, expenses: 0 };
    bucket.income += point.income;
    bucket.expenses += point.expenses;
    byWeek.set(week, bucket);
  }

  return [...byWeek.entries()]
    .filter(([, bucket]) => bucket.income !== 0 || bucket.expenses !== 0)
    .sort(([a], [b]) => a - b)
    .map(([week, bucket]) => ({
      label: `Sem ${week}`,
      income: Math.round(bucket.income),
      expenses: Math.round(bucket.expenses),
    }));
}
