import { describe, expect, it } from 'vitest';

import { resolveOpenBillDueDate } from './resolveOpenBillDueDate';

describe('resolveOpenBillDueDate', () => {
  it('returns the due date after the next closing of the open cycle', () => {
    // Closing day 1 already passed on July 17 → open cycle closes Aug 1 → due Aug 6
    expect(resolveOpenBillDueDate(1, 6, new Date(2026, 6, 17))).toBe('2026-08-06');
  });

  it('uses the closing day of the current month when it is still ahead', () => {
    // Closing day 28 is still ahead on July 18 → open cycle closes Jul 28 → due Aug 5
    expect(resolveOpenBillDueDate(28, 5, new Date(2026, 6, 18))).toBe('2026-08-05');
  });

  it('returns null when closing or due day is missing', () => {
    expect(resolveOpenBillDueDate(undefined, 6, new Date(2026, 6, 17))).toBeNull();
    expect(resolveOpenBillDueDate(1, undefined, new Date(2026, 6, 17))).toBeNull();
  });
});
