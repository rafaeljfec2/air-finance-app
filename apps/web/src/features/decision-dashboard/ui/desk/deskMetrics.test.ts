import { describe, expect, it } from 'vitest';

import {
  buildCategoryShares,
  countMovements,
  daysElapsedInMonth,
  expenseDailyAverage,
  incomeExpenseBarShares,
} from './deskMetrics';

describe('daysElapsedInMonth', () => {
  it('returns the calendar day of the month for a date in the current month', () => {
    expect(daysElapsedInMonth(new Date(2026, 6, 16))).toBe(16);
  });

  it('returns at least 1', () => {
    expect(daysElapsedInMonth(new Date(2026, 0, 1))).toBe(1);
  });
});

describe('expenseDailyAverage', () => {
  it('divides expenses by elapsed days', () => {
    expect(expenseDailyAverage(2621.1, 10)).toBeCloseTo(262.11, 2);
  });

  it('returns 0 when daysElapsed is 0', () => {
    expect(expenseDailyAverage(100, 0)).toBe(0);
  });
});

describe('incomeExpenseBarShares', () => {
  it('returns proportional shares for income and expenses', () => {
    expect(incomeExpenseBarShares(100, 50)).toEqual({ incomeShare: 2 / 3, expenseShare: 1 / 3 });
  });

  it('returns zero shares when both are zero', () => {
    expect(incomeExpenseBarShares(0, 0)).toEqual({ incomeShare: 0, expenseShare: 0 });
  });
});

describe('buildCategoryShares', () => {
  it('computes percentage over total expenses and keeps color', () => {
    const shares = buildCategoryShares(
      [
        { name: 'Moradia', value: 400, color: '#111' },
        { name: 'Alimentação', value: 100, color: '#222' },
      ],
      500,
      6,
    );

    expect(shares).toEqual([
      { name: 'Moradia', value: 400, color: '#111', percentage: 80 },
      { name: 'Alimentação', value: 100, color: '#222', percentage: 20 },
    ]);
  });

  it('groups overflow categories into Outros when over limit', () => {
    const shares = buildCategoryShares(
      [
        { name: 'A', value: 50, color: '#1' },
        { name: 'B', value: 40, color: '#2' },
        { name: 'C', value: 30, color: '#3' },
        { name: 'D', value: 20, color: '#4' },
      ],
      140,
      3,
    );

    expect(shares).toHaveLength(3);
    expect(shares[2]?.name).toBe('Outros');
    expect(shares[2]?.value).toBe(50);
  });
});

describe('countMovements', () => {
  it('counts items excluding previous-balance', () => {
    expect(countMovements([{ id: 'a' }, { id: 'previous-balance' }, { id: 'b' }])).toBe(2);
  });
});
