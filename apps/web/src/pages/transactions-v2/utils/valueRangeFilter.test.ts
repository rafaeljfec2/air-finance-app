import { describe, expect, it } from 'vitest';

import { matchesValueRange, VALUE_RANGE_OPTIONS } from './valueRangeFilter';

describe('matchesValueRange', () => {
  it('matches everything for any', () => {
    expect(matchesValueRange(0, 'any')).toBe(true);
    expect(matchesValueRange(99, 'any')).toBe(true);
    expect(matchesValueRange(10000, 'any')).toBe(true);
  });

  it('matches micro values below 100', () => {
    expect(matchesValueRange(99.99, 'micro')).toBe(true);
    expect(matchesValueRange(100, 'micro')).toBe(false);
  });

  it('matches standard values between 100 and 500', () => {
    expect(matchesValueRange(100, 'standard')).toBe(true);
    expect(matchesValueRange(499.99, 'standard')).toBe(true);
    expect(matchesValueRange(500, 'standard')).toBe(false);
    expect(matchesValueRange(99, 'standard')).toBe(false);
  });

  it('matches relevant values at or above 500', () => {
    expect(matchesValueRange(500, 'relevant')).toBe(true);
    expect(matchesValueRange(499.99, 'relevant')).toBe(false);
  });

  it('exposes options with any as default first entry', () => {
    expect(VALUE_RANGE_OPTIONS[0]).toEqual({ value: 'any', label: 'Qualquer valor' });
    expect(VALUE_RANGE_OPTIONS).toHaveLength(4);
  });
});
