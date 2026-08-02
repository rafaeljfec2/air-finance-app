import { describe, expect, it } from 'vitest';

import type { CreditCardSourceState } from '@/types/budget';

import type { OpenBillProjection } from './projectInstallmentsForOpenBill';
import { resolveComposedOpenBill } from './resolveComposedOpenBill';

const openBill: OpenBillProjection = {
  cycleAmount: 5477,
  projectedAmount: 500,
  totalEstimated: 5977,
  projectedInstallments: [],
  isEstimated: true,
};

function source(mode: CreditCardSourceState['mode']): CreditCardSourceState {
  return { mode };
}

describe('resolveComposedOpenBill', () => {
  it('prefers the composed budget total for OFX and COMBINED modes before closing', () => {
    expect(
      resolveComposedOpenBill({
        openBill,
        composedTotal: 11372.84,
        sourceState: source('COMBINED'),
        closingDay: 30,
        referenceDate: new Date(2026, 6, 20),
      }),
    ).toEqual({
      cycleAmount: 11372.84,
      projectedAmount: 0,
      totalEstimated: 11372.84,
      projectedInstallments: [],
      isEstimated: false,
    });

    expect(
      resolveComposedOpenBill({
        openBill,
        composedTotal: 11360.5,
        sourceState: source('OFX'),
        closingDay: 30,
        referenceDate: new Date(2026, 6, 20),
      })?.totalEstimated,
    ).toBe(11360.5);
  });

  it('prefers the open-cycle projection after the closing day', () => {
    expect(
      resolveComposedOpenBill({
        openBill,
        composedTotal: 11372.84,
        sourceState: source('COMBINED'),
        closingDay: 30,
        referenceDate: new Date(2026, 6, 31),
      }),
    ).toEqual(openBill);
  });

  it('keeps the Open Finance projection when there is no OFX baseline', () => {
    expect(
      resolveComposedOpenBill({
        openBill,
        composedTotal: 5477,
        sourceState: source('OPEN_FINANCE'),
      }),
    ).toEqual(openBill);
  });

  it('falls back to the Open Finance projection when composed total is missing', () => {
    expect(
      resolveComposedOpenBill({
        openBill,
        composedTotal: null,
        sourceState: source('COMBINED'),
      }),
    ).toEqual(openBill);
  });
});
