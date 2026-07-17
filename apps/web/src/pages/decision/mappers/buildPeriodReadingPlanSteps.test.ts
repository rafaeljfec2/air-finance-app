import { describe, expect, it } from 'vitest';

import type { CompletePlanResponse } from '@/services/completePlanService';

import { buildPeriodReadingPlanSteps } from './buildPeriodReadingPlanSteps';

function minimalPlan(overrides: Partial<CompletePlanResponse> = {}): CompletePlanResponse {
  return {
    status: 'attention',
    primary_issue: 'high_commitment',
    theme_phase: 'yellow',
    diagnosis: 'Diagnóstico',
    coherenceNote: 'Nota',
    numbers: {
      netIncome: 10000,
      totalCommitted: 5000,
      committedPct: 0.5,
      healthyTargetPct: 0.3,
      reductionNeeded: 2000,
    },
    projection: {
      in30Days: { totalCommitted: 4800, committedPct: 0.48, installmentsEnding: 0 },
      in60Days: { totalCommitted: 4500, committedPct: 0.45, installmentsEnding: 1 },
      in90Days: { totalCommitted: 4000, committedPct: 0.4, installmentsEnding: 2 },
      ifNoChange: 'Pressão segue alta',
    },
    installmentsStrategy: {
      items: [],
      suggestion: 'Renegociar a parcela mais cara',
    },
    behavior: {
      topCategories: [],
      peakDaysOfMonth: [10, 15],
      creditUtilizationTrend: null,
    },
    variableSpending: {
      bucketHealth: 'attention',
      totalVariable: 3000,
      previousTotalVariable: 2800,
      percentOfIncome: 0.3,
      monthOverMonthChangePct: null,
      topCategories: [],
      peakDaysOfMonth: null,
    },
    personalRules: [
      { id: 'r1', text: 'Não parcelar compras novas', rationale: '...' },
      { id: 'r2', text: 'Pagar o mínimo das faturas', rationale: '...' },
      { id: 'r3', text: 'Revisar assinaturas', rationale: '...' },
    ],
    simpleRule: 'Comprar só o essencial até o dia 20',
    expectedOutcome: 'Em 90 dias a pressão cai',
    llmCached: false,
    referencePeriod: '2026-07',
    generatedAt: '2026-07-17T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildPeriodReadingPlanSteps', () => {
  it('returns three reading steps from existing plan fields', () => {
    const steps = buildPeriodReadingPlanSteps(minimalPlan());
    expect(steps).toHaveLength(3);
    expect(steps[0].title).toBe('Pare de piorar');
    expect(steps[1].items[0]).toContain('Renegociar');
    expect(steps[2].items.some((item) => item.includes('2.000'))).toBe(true);
  });
});
