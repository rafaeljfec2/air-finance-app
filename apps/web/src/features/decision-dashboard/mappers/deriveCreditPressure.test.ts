import { describe, expect, it } from 'vitest';

import { deriveCreditPressure } from './deriveCreditPressure';

describe('deriveCreditPressure', () => {
  it('is true only for high or critical utilization', () => {
    expect(
      deriveCreditPressure({ creditUtilizationStatus: 'high', hasOpenUnpaidBill: false }),
    ).toBe(true);
    expect(
      deriveCreditPressure({ creditUtilizationStatus: 'critical', hasOpenUnpaidBill: false }),
    ).toBe(true);
    expect(
      deriveCreditPressure({ creditUtilizationStatus: 'moderate', hasOpenUnpaidBill: false }),
    ).toBe(false);
  });

  it('is true when there is an open unpaid bill', () => {
    expect(deriveCreditPressure({ creditUtilizationStatus: 'low', hasOpenUnpaidBill: true })).toBe(
      true,
    );
  });

  it('does not treat closed bills alone as pressure', () => {
    expect(
      deriveCreditPressure({ creditUtilizationStatus: undefined, hasOpenUnpaidBill: false }),
    ).toBe(false);
  });
});
