import { describe, expect, it } from 'vitest';

import { formatPeriodRangeLabel } from './formatPeriodRangeLabel';

describe('formatPeriodRangeLabel', () => {
  it('formats a 31-day month range in Portuguese', () => {
    expect(formatPeriodRangeLabel(2026, 7)).toBe('01 a 31 de julho de 2026');
  });

  it('formats a 30-day month range', () => {
    expect(formatPeriodRangeLabel(2026, 4)).toBe('01 a 30 de abril de 2026');
  });

  it('handles February in a leap year', () => {
    expect(formatPeriodRangeLabel(2024, 2)).toBe('01 a 29 de fevereiro de 2024');
  });

  it('handles February in a non-leap year', () => {
    expect(formatPeriodRangeLabel(2026, 2)).toBe('01 a 28 de fevereiro de 2026');
  });

  it('throws for an out-of-range month', () => {
    expect(() => formatPeriodRangeLabel(2026, 13)).toThrow(RangeError);
    expect(() => formatPeriodRangeLabel(2026, 0)).toThrow(RangeError);
  });
});
