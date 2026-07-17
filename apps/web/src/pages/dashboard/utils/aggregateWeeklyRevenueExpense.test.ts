import { describe, expect, it } from 'vitest';

import type { BalanceHistoryPoint } from '@/types/dashboard';

import { aggregateWeeklyRevenueExpense } from './aggregateWeeklyRevenueExpense';

function point(date: string, income: number, expenses: number): BalanceHistoryPoint {
  return { date, income, expenses, balance: income - expenses };
}

describe('aggregateWeeklyRevenueExpense', () => {
  it('returns empty array for no points', () => {
    expect(aggregateWeeklyRevenueExpense([])).toEqual([]);
  });

  it('groups daily points into calendar weeks of the month', () => {
    const points = [
      point('2026-07-01T12:00:00Z', 100, 50),
      point('2026-07-03T12:00:00Z', 200, 25),
      point('2026-07-08T12:00:00Z', 0, 300),
      point('2026-07-20T12:00:00Z', 500, 100),
    ];

    const weeks = aggregateWeeklyRevenueExpense(points);

    expect(weeks).toEqual([
      { label: 'Sem 1', income: 300, expenses: 75 },
      { label: 'Sem 2', income: 0, expenses: 300 },
      { label: 'Sem 3', income: 500, expenses: 100 },
    ]);
  });

  it('rounds aggregated values', () => {
    const points = [
      point('2026-07-01T12:00:00Z', 10.4, 5.6),
      point('2026-07-02T12:00:00Z', 0.3, 0.1),
    ];

    expect(aggregateWeeklyRevenueExpense(points)).toEqual([
      { label: 'Sem 1', income: 11, expenses: 6 },
    ]);
  });

  it('skips weeks without activity', () => {
    const points = [
      point('2026-07-01T12:00:00Z', 100, 0),
      point('2026-07-10T12:00:00Z', 0, 0),
      point('2026-07-16T12:00:00Z', 0, 40),
    ];

    expect(aggregateWeeklyRevenueExpense(points)).toEqual([
      { label: 'Sem 1', income: 100, expenses: 0 },
      { label: 'Sem 3', income: 0, expenses: 40 },
    ]);
  });
});
