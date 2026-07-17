import { describe, expect, it } from 'vitest';

import { buildPeriodReadingJourney } from './buildPeriodReadingJourney';

describe('buildPeriodReadingJourney', () => {
  it('builds five stages from summary and numbers', () => {
    const stages = buildPeriodReadingJourney({
      income: 10000,
      expenses: 8000,
      numbers: {
        netIncome: 10000,
        totalCommitted: 4000,
        committedPct: 0.4,
        healthyTargetPct: 0.3,
        reductionNeeded: 1000,
      },
    });

    expect(stages).toHaveLength(5);
    expect(stages[0].id).toBe('income');
    expect(stages[2].id).toBe('installments');
    expect(stages[3].valueLabel).toBe('20% da renda');
  });
});
