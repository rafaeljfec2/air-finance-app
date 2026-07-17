import { describe, expect, it } from 'vitest';

import { buildPeriodReadingPressure } from './buildPeriodReadingPressure';

describe('buildPeriodReadingPressure', () => {
  it('returns three cards with contracted percents', () => {
    const cards = buildPeriodReadingPressure({
      numbers: {
        netIncome: 10000,
        totalCommitted: 4000,
        committedPct: 0.4,
        healthyTargetPct: 0.3,
        reductionNeeded: 1000,
      },
      variableSpending: {
        bucketHealth: 'attention',
        totalVariable: 3000,
        previousTotalVariable: 2800,
        percentOfIncome: 0.3,
        monthOverMonthChangePct: 0.07,
        topCategories: [],
        peakDaysOfMonth: null,
      },
    });

    expect(cards).toHaveLength(3);
    expect(cards[0].percentOfIncome).toBe(0.4);
    expect(cards[1].percentOfIncome).toBe(0.3);
    expect(cards[2].amount).toBe(3000);
  });
});
