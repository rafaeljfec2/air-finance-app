import { describe, expect, it } from 'vitest';

import { getStatementPeriodRange } from './getStatementPeriodRange';

describe('getStatementPeriodRange', () => {
  it('returns last 30 calendar days inclusive for preset 30', () => {
    const range = getStatementPeriodRange(30, new Date(2026, 6, 11));
    expect(range).toEqual({
      startDate: '2026-06-12',
      endDate: '2026-07-11',
    });
  });

  it('returns last 60 calendar days inclusive for preset 60', () => {
    const range = getStatementPeriodRange(60, new Date(2026, 6, 11));
    expect(range).toEqual({
      startDate: '2026-05-13',
      endDate: '2026-07-11',
    });
  });

  it('returns last 90 calendar days inclusive for preset 90', () => {
    const range = getStatementPeriodRange(90, new Date(2026, 6, 11));
    expect(range).toEqual({
      startDate: '2026-04-13',
      endDate: '2026-07-11',
    });
  });

  it('shifts the window backward when offset is positive', () => {
    const range = getStatementPeriodRange(30, new Date(2026, 6, 11), 1);
    expect(range).toEqual({
      startDate: '2026-05-13',
      endDate: '2026-06-11',
    });
  });
});
