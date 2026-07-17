import { describe, expect, it } from 'vitest';

import type { BalanceHistoryPoint } from '@/types/dashboard';

import { buildExpenseCalendar } from './buildExpenseCalendar';

function point(
  date: string,
  expenses: number,
  expenseTransactionCount = expenses > 0 ? 1 : 0,
): BalanceHistoryPoint {
  return { date, income: 0, expenses, balance: -expenses, expenseTransactionCount };
}

describe('buildExpenseCalendar', () => {
  it('builds a full month grid with leading days from the previous month', () => {
    const calendar = buildExpenseCalendar(new Date(2026, 6, 1), []);

    expect(calendar.leadingDays).toEqual([28, 29, 30]);
    expect(calendar.days).toHaveLength(31);
    expect(calendar.days[0]).toEqual({
      day: 1,
      expenses: 0,
      expenseTransactionCount: 0,
      hasExpense: false,
    });
  });

  it('completes the last row with trailing days from the next month', () => {
    const june = buildExpenseCalendar(new Date(2026, 5, 1), []);
    expect(june.leadingDays).toEqual([31]);
    expect(june.trailingDays).toEqual([1, 2, 3, 4]);

    const july = buildExpenseCalendar(new Date(2026, 6, 1), []);
    expect(july.trailingDays).toEqual([1]);
  });

  it('aggregates expenses and transaction counts for days with activity', () => {
    const calendar = buildExpenseCalendar(new Date(2026, 6, 1), [
      point('2026-07-05T12:00:00Z', 150.4, 2),
      point('2026-07-05T18:00:00Z', 49.6, 1),
      point('2026-07-31T03:00:00Z', 10, 1),
    ]);

    expect(calendar.days[4]).toEqual({
      day: 5,
      expenses: 200,
      expenseTransactionCount: 3,
      hasExpense: true,
    });
    expect(calendar.days[30]).toEqual({
      day: 31,
      expenses: 10,
      expenseTransactionCount: 1,
      hasExpense: true,
    });
    expect(calendar.days[10].hasExpense).toBe(false);
  });

  it('ignores points from other months', () => {
    const calendar = buildExpenseCalendar(new Date(2026, 6, 1), [
      point('2026-06-30T12:00:00Z', 999, 4),
      point('2026-08-01T12:00:00Z', 999, 4),
    ]);

    expect(calendar.days.every((d) => !d.hasExpense && d.expenseTransactionCount === 0)).toBe(true);
  });
});
