import { describe, expect, it } from 'vitest';

import type { CompletePlanResponse } from '@/services/completePlanService';

import { buildPeriodReadingBehaviorCards } from './buildPeriodReadingBehaviorCards';

function planFixture(): CompletePlanResponse {
  return {
    status: 'attention',
    primary_issue: 'high_commitment',
    theme_phase: 'yellow',
    diagnosis: 'd',
    coherenceNote: 'c',
    numbers: {
      netIncome: 10000,
      totalCommitted: 4000,
      committedPct: 0.4,
      healthyTargetPct: 0.3,
      reductionNeeded: 1000,
    },
    projection: {
      in30Days: { totalCommitted: 1, committedPct: 0.1, installmentsEnding: 0 },
      in60Days: { totalCommitted: 1, committedPct: 0.1, installmentsEnding: 0 },
      in90Days: { totalCommitted: 1, committedPct: 0.1, installmentsEnding: 0 },
      ifNoChange: 'x',
    },
    installmentsStrategy: { items: [], suggestion: '' },
    behavior: {
      topCategories: [{ name: 'Moradia', amount: 2000, share: 0.45 }],
      peakDaysOfMonth: [10, 20],
      creditUtilizationTrend: null,
    },
    variableSpending: {
      bucketHealth: 'attention',
      totalVariable: 3000,
      previousTotalVariable: 2800,
      percentOfIncome: 0.3,
      monthOverMonthChangePct: null,
      topCategories: [{ name: 'Moradia', amount: 2000, share: 0.45 }],
      peakDaysOfMonth: [10, 20],
    },
    personalRules: [],
    simpleRule: '',
    expectedOutcome: '',
    llmCached: false,
    referencePeriod: '2026-07',
    generatedAt: '2026-07-17T00:00:00.000Z',
  };
}

describe('buildPeriodReadingBehaviorCards', () => {
  it('builds cards without inventing subscriptions or interest', () => {
    const cards = buildPeriodReadingBehaviorCards(planFixture());
    expect(cards.some((card) => card.id === 'peaks')).toBe(true);
    expect(cards.every((card) => !/assinatura|juros/i.test(card.title))).toBe(true);
  });
});
