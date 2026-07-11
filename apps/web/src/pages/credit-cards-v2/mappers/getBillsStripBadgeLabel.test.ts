import { describe, expect, it } from 'vitest';

import { getBillsStripCountLabel, getBillsStripMoreBadgeLabel } from './getBillsStripBadgeLabel';

describe('getBillsStripCountLabel', () => {
  it('uses singular for one bill', () => {
    expect(getBillsStripCountLabel(1)).toBe('1 fatura');
  });

  it('uses plural for multiple bills', () => {
    expect(getBillsStripCountLabel(12)).toBe('12 faturas');
  });
});

describe('getBillsStripMoreBadgeLabel', () => {
  it('returns null when there is no overflow', () => {
    expect(getBillsStripMoreBadgeLabel(12, false)).toBeNull();
  });

  it('returns null when there are no bills', () => {
    expect(getBillsStripMoreBadgeLabel(0, true)).toBeNull();
  });

  it('returns badge text when the list can scroll further', () => {
    expect(getBillsStripMoreBadgeLabel(12, true)).toBe('Mais faturas · 12');
  });
});
