import { describe, expect, it } from 'vitest';

import { getBestPurchaseDay } from './getBestPurchaseDay';

const REFERENCE_DATE = new Date(2026, 6, 18);

describe('getBestPurchaseDay', () => {
  it('suggests the day after the next closing date of the card with the largest float', () => {
    const result = getBestPurchaseDay(
      [{ name: 'ultraviolet+black', closingDay: 28, dueDay: 5, isActive: true }],
      REFERENCE_DATE,
    );

    expect(result).toEqual({
      date: '2026-07-29',
      cardName: 'ultraviolet+black',
      floatDays: 38,
    });
  });

  it('picks the card with the largest float when there are multiple cards', () => {
    const result = getBestPurchaseDay(
      [
        { name: 'Card A', closingDay: 20, dueDay: 25, isActive: true },
        { name: 'Card B', closingDay: 28, dueDay: 5, isActive: true },
      ],
      REFERENCE_DATE,
    );

    expect(result?.cardName).toBe('Card B');
  });

  it('ignores inactive cards', () => {
    const result = getBestPurchaseDay(
      [
        { name: 'Inactive', closingDay: 28, dueDay: 5, isActive: false },
        { name: 'Active', closingDay: 20, dueDay: 25, isActive: true },
      ],
      REFERENCE_DATE,
    );

    expect(result?.cardName).toBe('Active');
  });

  it('returns null when no active card has both closing and due days', () => {
    const result = getBestPurchaseDay(
      [
        { name: 'No closing', dueDay: 5, isActive: true },
        { name: 'No due', closingDay: 28, isActive: true },
      ],
      REFERENCE_DATE,
    );

    expect(result).toBeNull();
  });

  it('returns null for an empty card list', () => {
    expect(getBestPurchaseDay([], REFERENCE_DATE)).toBeNull();
  });
});
