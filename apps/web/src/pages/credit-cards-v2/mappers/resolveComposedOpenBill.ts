import type { CreditCardSourceState } from '@/types/budget';

import type { OpenBillProjection } from './projectInstallmentsForOpenBill';

interface ResolveComposedOpenBillParams {
  readonly openBill: OpenBillProjection | null;
  readonly composedTotal: number | null;
  readonly sourceState: CreditCardSourceState | null | undefined;
}

export function resolveComposedOpenBill({
  openBill,
  composedTotal,
  sourceState,
}: ResolveComposedOpenBillParams): OpenBillProjection | null {
  const mode = sourceState?.mode;
  const shouldPreferComposed = mode === 'OFX' || mode === 'COMBINED';

  if (shouldPreferComposed && composedTotal !== null) {
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
