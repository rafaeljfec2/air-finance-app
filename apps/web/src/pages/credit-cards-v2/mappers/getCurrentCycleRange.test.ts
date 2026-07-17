import { describe, expect, it } from 'vitest';

import { getCurrentCycleRange } from './getCurrentCycleRange';

describe('getCurrentCycleRange', () => {
  it('uses the closing day of the current month when it has already passed', () => {
    const range = getCurrentCycleRange(1, new Date(2026, 6, 17));

    expect(range).toEqual({
      startDate: '2026-07-01',
      endDate: '2026-07-17',
    });
  });

  it('uses the previous month closing when the closing day has not arrived yet', () => {
    const range = getCurrentCycleRange(28, new Date(2026, 6, 17));

    expect(range).toEqual({
      startDate: '2026-06-28',
      endDate: '2026-07-17',
    });
  });

  it('starts and ends on the same day when today is the closing day', () => {
    const range = getCurrentCycleRange(28, new Date(2026, 6, 28));

    expect(range).toEqual({
      startDate: '2026-07-28',
      endDate: '2026-07-28',
    });
  });

  it('clamps closing day 31 to the last day of shorter months', () => {
    const range = getCurrentCycleRange(31, new Date(2026, 1, 15));

    expect(range).toEqual({
      startDate: '2026-01-31',
      endDate: '2026-02-15',
    });
  });

  it('returns null when closing day is missing', () => {
    expect(getCurrentCycleRange(undefined, new Date(2026, 6, 17))).toBeNull();
  });
});
