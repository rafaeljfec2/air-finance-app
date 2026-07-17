import { describe, expect, it } from 'vitest';

import type { BalanceHistoryPoint } from '@/types/dashboard';

import { buildExpenseCalendar } from './buildExpenseCalendar';

function point(date: string, expenses: number): BalanceHistoryPoint {
  return { date, income: 0, expenses, balance: -expenses };
}

describe('buildExpenseCalendar', () => {
  it('builds a full month grid with leading days from the previous month', () => {
    // July 2026 starts on a Wednesday → leading days Sun 28, Mon 29, Tue 30 (June)
    const calendar = buildExpenseCalendar(new Date(2026, 6, 1), []);

    expect(calendar.leadingDays).toEqual([28, 29, 30]);
    expect(calendar.days).toHaveLength(31);
    expect(calendar.days[0]).toEqual({ day: 1, expenses: 0, hasExpense: false });
  });

  it('completes the last row with trailing days from the next month', () => {
    // June 2026 ends on Tuesday 30 → trailing Wed 1 to Sat 4 (July)
    const june = buildExpenseCalendar(new Date(2026, 5, 1), []);
    expect(june.leadingDays).toEqual([31]);
    expect(june.trailingDays).toEqual([1, 2, 3, 4]);

    // July 2026 ends on Friday 31 → trailing Sat 1 (August)
    const july = buildExpenseCalendar(new Date(2026, 6, 1), []);
    expect(july.trailingDays).toEqual([1]);
  });

  it('returns no leading or trailing days when the month fills its rows', () => {
    // February 2026 starts on Sunday and ends on Saturday
    const calendar = buildExpenseCalendar(new Date(2026, 1, 1), []);

    expect(calendar.leadingDays).toEqual([]);
    expect(calendar.trailingDays).toEqual([]);
    expect(calendar.days).toHaveLength(28);
  });

  it('marks days that have expenses from balance history', () => {
    const calendar = buildExpenseCalendar(new Date(2026, 6, 1), [
      point('2026-07-05T12:00:00Z', 150.4),
      point('2026-07-05T18:00:00Z', 49.6),
      point('2026-07-31T03:00:00Z', 10),
    ]);

    expect(calendar.days[4]).toEqual({ day: 5, expenses: 200, hasExpense: true });
    expect(calendar.days[30]).toEqual({ day: 31, expenses: 10, hasExpense: true });
    expect(calendar.days[10].hasExpense).toBe(false);
  });

  it('ignores points from other months', () => {
    const calendar = buildExpenseCalendar(new Date(2026, 6, 1), [
      point('2026-06-30T12:00:00Z', 999),
      point('2026-08-01T12:00:00Z', 999),
    ]);

    expect(calendar.days.every((d) => !d.hasExpense)).toBe(true);
  });
});
