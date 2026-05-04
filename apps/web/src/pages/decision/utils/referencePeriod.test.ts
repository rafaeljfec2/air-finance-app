import { describe, expect, it } from 'vitest';

import {
  buildYYYYMM,
  getCurrentYYYYMM,
  resolveEvaluateAutoReferencePeriod,
} from './referencePeriod';

describe('referencePeriod utils', () => {
  it('formats YYYY-MM with zero-padded month', () => {
    expect(buildYYYYMM(2026, 1)).toBe('2026-01');
    expect(buildYYYYMM(2026, 12)).toBe('2026-12');
  });

  it('throws when month is out of range', () => {
    expect(() => buildYYYYMM(2026, 0)).toThrow(RangeError);
    expect(() => buildYYYYMM(2026, 13)).toThrow(RangeError);
  });

  it('returns local calendar YYYY-MM for getCurrentYYYYMM', () => {
    const d = new Date(2026, 4, 15);
    expect(getCurrentYYYYMM(d)).toBe('2026-05');
  });

  it('omits referencePeriod when selected month equals current month', () => {
    const now = new Date(2026, 4, 3);
    expect(resolveEvaluateAutoReferencePeriod(2026, 5, now)).toBeUndefined();
  });

  it('returns YYYY-MM when selected month is not the current month', () => {
    const now = new Date(2026, 4, 3);
    expect(resolveEvaluateAutoReferencePeriod(2026, 4, now)).toBe('2026-04');
    expect(resolveEvaluateAutoReferencePeriod(2025, 5, now)).toBe('2025-05');
  });
});
