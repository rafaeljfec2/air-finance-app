import { describe, expect, it } from 'vitest';

import { getStatementPeriodRangeForBill } from './getStatementPeriodRangeForBill';

describe('getStatementPeriodRangeForBill', () => {
  it('builds a 90/7 day window around the bill due date', () => {
    expect(getStatementPeriodRangeForBill('2026-03-15')).toEqual({
      startDate: '2025-12-15',
      endDate: '2026-03-22',
    });
  });

  it('accepts ISO datetime due dates', () => {
    expect(getStatementPeriodRangeForBill('2025-11-10T00:00:00.000Z')).toEqual({
      startDate: '2025-08-12',
      endDate: '2025-11-17',
    });
  });

  it('allows custom before/after day windows', () => {
    expect(getStatementPeriodRangeForBill('2026-07-01', 10, 2)).toEqual({
      startDate: '2026-06-21',
      endDate: '2026-07-03',
    });
  });
});
