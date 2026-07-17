import type { CreditCardOverview } from './buildCreditCardOverview';

export interface CreditCardsKpis {
  readonly totalBills: number | null;
  readonly cycleTotal: number | null;
  readonly projectedInstallmentsTotal: number | null;
  readonly hasEstimatedBills: boolean;
  readonly activeCardsCount: number;
  readonly limitTotal: number | null;
  readonly limitUsed: number | null;
  readonly limitAvailable: number | null;
  readonly usagePercent: number | null;
}

function sumOrNull(values: ReadonlyArray<number | null>): number | null {
  const present = values.filter((value): value is number => value !== null);
  if (present.length === 0) {
    return null;
  }
  return present.reduce((total, value) => total + value, 0);
}

/**
 * Consolidates the KPI strip values from the active cards only. Aggregates are
 * `null` (rendered as "—") when no active card exposes the underlying data.
 */
export function buildCreditCardsKpis(
  overviews: ReadonlyArray<CreditCardOverview>,
): CreditCardsKpis {
  const active = overviews.filter((overview) => overview.isActive);

  const limitTotal = sumOrNull(active.map((overview) => overview.limitTotal));
  const limitUsed = sumOrNull(active.map((overview) => overview.limitUsed));

  return {
    totalBills: sumOrNull(active.map((overview) => overview.currentBillAmount)),
    cycleTotal: sumOrNull(active.map((overview) => overview.cycleBillAmount)),
    projectedInstallmentsTotal: sumOrNull(
      active.map((overview) => overview.projectedInstallmentsAmount),
    ),
    hasEstimatedBills: active.some((overview) => overview.isBillEstimated),
    activeCardsCount: active.length,
    limitTotal,
    limitUsed,
    limitAvailable: sumOrNull(active.map((overview) => overview.limitAvailable)),
    usagePercent:
      limitTotal !== null && limitUsed !== null && limitTotal > 0
        ? Math.round((limitUsed / limitTotal) * 100)
        : null,
  };
}
