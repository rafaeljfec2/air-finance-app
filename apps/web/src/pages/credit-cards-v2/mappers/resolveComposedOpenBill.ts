import type { CreditCardSourceState } from '@/types/budget';

import { isAfterClosingDay } from './getCurrentCycleRange';
import type { OpenBillProjection } from './projectInstallmentsForOpenBill';

interface ResolveComposedOpenBillParams {
  readonly openBill: OpenBillProjection | null;
  readonly composedTotal: number | null;
  readonly sourceState: CreditCardSourceState | null | undefined;
  readonly closingDay?: number | null;
  readonly referenceDate?: Date;
}

/**
 * OFX / COMBINED prefer the composed budget total while the statement cycle is
 * still open. After the card closing day, the composed month total is the
 * closed bill — prefer the Open Finance open-cycle projection instead.
 */
export function resolveComposedOpenBill({
  openBill,
  composedTotal,
  sourceState,
  closingDay,
  referenceDate,
}: ResolveComposedOpenBillParams): OpenBillProjection | null {
  const mode = sourceState?.mode;
  const shouldPreferComposed = mode === 'OFX' || mode === 'COMBINED';

  if (
    shouldPreferComposed &&
    composedTotal !== null &&
    !(
      typeof closingDay === 'number' &&
      referenceDate &&
      isAfterClosingDay(closingDay, referenceDate)
    )
  ) {
    return {
      cycleAmount: composedTotal,
      projectedAmount: 0,
      totalEstimated: composedTotal,
      projectedInstallments: [],
      isEstimated: false,
    };
  }

  return openBill;
}
