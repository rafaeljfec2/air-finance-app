import { describe, expect, it } from 'vitest';

import { buildHistoryFetchSlices, dedupeTransactionsById } from './buildHistoryFetchSlices';

describe('buildHistoryFetchSlices', () => {
  it('builds non-empty slices covering the lookback window', () => {
    const slices = buildHistoryFetchSlices(new Date(2026, 6, 17), 12, 3);
    expect(slices.length).toBeGreaterThanOrEqual(4);
    expect(slices[0]?.endDate).toBe('2026-07-17');
    expect(slices[slices.length - 1]?.startDate).toBe('2025-07-01');
  });
});

describe('dedupeTransactionsById', () => {
  it('keeps the first occurrence of each id', () => {
    expect(
      dedupeTransactionsById([
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
        { id: 'a', value: 3 },
      ]),
    ).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ]);
  });
});
