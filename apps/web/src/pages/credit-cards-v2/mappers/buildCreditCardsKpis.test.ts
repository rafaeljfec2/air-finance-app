import { describe, expect, it } from 'vitest';

import type { CreditCardOverview } from './buildCreditCardOverview';
import { buildCreditCardsKpis } from './buildCreditCardsKpis';

function buildOverview(overrides: Partial<CreditCardOverview> = {}): CreditCardOverview {
  return {
    cardId: 'acc-1',
    name: 'ultraviolet+black',
    brand: 'MASTERCARD',
    digits: '4037',
    color: '#8A05BE',
    isActive: true,
    currentBillAmount: 11067.92,
    cycleBillAmount: 5477.85,
    projectedInstallmentsAmount: 5590.07,
    projectedInstallments: [],
    isBillEstimated: true,
    currentBillDueDate: '2026-08-05',
    lastClosedBillId: null,
    lastClosedBillAmount: null,
    lastClosedBillDueDate: null,
    nextClosingDate: '2026-07-28',
    limitTotal: 20000,
    limitUsed: 1800,
    limitAvailable: 18200,
    usagePercent: 9,
    ...overrides,
  };
}

describe('buildCreditCardsKpis', () => {
  it('aggregates bills and limits from active cards only', () => {
    const kpis = buildCreditCardsKpis([
      buildOverview(),
      buildOverview({
        cardId: 'acc-2',
        name: 'Itaú Uniclass',
        currentBillAmount: 2345.18,
        limitTotal: 14500,
        limitUsed: 3612.23,
        limitAvailable: 10887.77,
      }),
      buildOverview({
        cardId: 'acc-3',
        name: 'Inter Gold',
        isActive: false,
        currentBillAmount: 999,
        limitTotal: 5000,
        limitUsed: 100,
        limitAvailable: 4900,
      }),
    ]);

    expect(kpis.totalBills).toBeCloseTo(13413.1);
    expect(kpis.cycleTotal).toBeCloseTo(10955.7);
    expect(kpis.projectedInstallmentsTotal).toBeCloseTo(11180.14);
    expect(kpis.hasEstimatedBills).toBe(true);
    expect(kpis.activeCardsCount).toBe(2);
    expect(kpis.limitTotal).toBe(34500);
    expect(kpis.limitUsed).toBeCloseTo(5412.23);
    expect(kpis.limitAvailable).toBeCloseTo(29087.77);
    expect(kpis.usagePercent).toBe(16);
  });

  it('returns null aggregates when no active card has limit data', () => {
    const kpis = buildCreditCardsKpis([
      buildOverview({
        currentBillAmount: null,
        cycleBillAmount: null,
        projectedInstallmentsAmount: null,
        isBillEstimated: false,
        limitTotal: null,
        limitUsed: null,
        limitAvailable: null,
        usagePercent: null,
      }),
    ]);

    expect(kpis.totalBills).toBeNull();
    expect(kpis.cycleTotal).toBeNull();
    expect(kpis.projectedInstallmentsTotal).toBeNull();
    expect(kpis.hasEstimatedBills).toBe(false);
    expect(kpis.limitTotal).toBeNull();
    expect(kpis.limitUsed).toBeNull();
    expect(kpis.limitAvailable).toBeNull();
    expect(kpis.usagePercent).toBeNull();
    expect(kpis.activeCardsCount).toBe(1);
  });

  it('handles an empty overview list', () => {
    const kpis = buildCreditCardsKpis([]);

    expect(kpis.totalBills).toBeNull();
    expect(kpis.activeCardsCount).toBe(0);
    expect(kpis.usagePercent).toBeNull();
  });
});
