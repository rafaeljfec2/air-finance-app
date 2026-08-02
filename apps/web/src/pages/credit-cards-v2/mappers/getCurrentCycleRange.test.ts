import { describe, expect, it } from 'vitest';

import { cycleIndexOf, getCurrentCycleRange, isAfterClosingDay } from './getCurrentCycleRange';

describe('getCurrentCycleRange', () => {
  it('opens the day after closing when the closing day has already passed', () => {
    const range = getCurrentCycleRange(1, new Date(2026, 6, 17));

    expect(range).toEqual({
      startDate: '2026-07-02',
      endDate: '2026-07-17',
    });
  });

  it('uses the day after the previous month closing when closing has not arrived yet', () => {
    const range = getCurrentCycleRange(28, new Date(2026, 6, 17));

    expect(range).toEqual({
      startDate: '2026-06-29',
      endDate: '2026-07-17',
    });
  });

  it('leaves the next cycle unopened on the closing day', () => {
    const range = getCurrentCycleRange(28, new Date(2026, 6, 28));

    expect(range).toEqual({
      startDate: '2026-07-29',
      endDate: '2026-07-28',
    });
    expect(range!.startDate > range!.endDate).toBe(true);
  });

  it('puts 31/07 in the open cycle after closing day 30', () => {
    const range = getCurrentCycleRange(30, new Date(2026, 6, 31));

    expect(range).toEqual({
      startDate: '2026-07-31',
      endDate: '2026-07-31',
    });
  });

  it('clamps closing day 31 to the last day of shorter months', () => {
    const range = getCurrentCycleRange(31, new Date(2026, 1, 15));

    expect(range).toEqual({
      startDate: '2026-02-01',
      endDate: '2026-02-15',
    });
  });

  it('returns null when closing day is missing', () => {
    expect(getCurrentCycleRange(undefined, new Date(2026, 6, 17))).toBeNull();
  });
});

describe('cycleIndexOf', () => {
  it('uses distinct indices for closed and open cycles around closing day 30', () => {
    expect(cycleIndexOf(new Date(2026, 6, 31), 30)).toBe(
      cycleIndexOf(new Date(2026, 6, 30), 30) + 1,
    );
  });
});

describe('isAfterClosingDay', () => {
  it('detects dates after the closing day in the same month', () => {
    expect(isAfterClosingDay(30, new Date(2026, 6, 31))).toBe(true);
    expect(isAfterClosingDay(30, new Date(2026, 6, 30))).toBe(false);
  });
});
