import { describe, expect, it } from 'vitest';

import type { DashboardSummary } from '@/types/dashboard';
import type { IndebtednessMetrics } from '@/types/indebtedness';

import { mapLiveMetricsToPillars } from './mapLiveMetricsToPillars';

const emptySummary = (): DashboardSummary => ({
  income: 10000,
  expenses: 7000,
  balance: 3000,
  previousIncome: null,
  previousExpenses: null,
  previousBalance: null,
  accumulatedBalance: null,
  incomeChangePct: null,
  expensesChangePct: null,
  balanceChangePct: null,
  periodStart: '2026-07-01',
  periodEnd: '2026-07-31',
});

const sampleIndebtedness = (): IndebtednessMetrics => ({
  creditUtilization: {
    used: 2000,
    available: 8000,
    total: 10000,
    percentage: 20,
    status: 'low',
  },
  totalDebt: 5000,
  liquidity: {
    available: 15000,
    obligations: 3000,
    ratio: 5,
    status: 'positive',
  },
  debtToRevenue: {
    debt: 5000,
    monthlyRevenue: 10000,
    percentage: 50,
  },
  accountBalances: {
    positive: 15000,
    negative: 0,
    net: 15000,
  },
});

function collectUserFacingCopy(checkup: ReturnType<typeof mapLiveMetricsToPillars>): string {
  return checkup.pillars
    .flatMap((pillar) => [
      pillar.name,
      pillar.question,
      pillar.horizonLabel,
      pillar.primaryLabel,
      pillar.primaryFormatted ?? '',
      pillar.interpretation,
      pillar.summarySentence,
      pillar.exploreHint ?? '',
      ...pillar.influencers.improves,
      ...pillar.influencers.worsens,
      ...pillar.connections,
    ])
    .concat([checkup.surfaceQuestion, checkup.closingSynthesis])
    .join(' ');
}

describe('mapLiveMetricsToPillars', () => {
  it('returns six pillars in canonical order', () => {
    const checkup = mapLiveMetricsToPillars({
      summary: emptySummary(),
      indebtedness: sampleIndebtedness(),
    });

    expect(checkup.pillars.map((p) => p.id)).toEqual([
      'liquidity',
      'flow',
      'structure',
      'credit',
      'resilience',
      'wealth',
    ]);
    expect(checkup.surfaceQuestion).toContain('capacidade financeira');
  });

  it('marks pillars inconclusive when live data is missing', () => {
    const checkup = mapLiveMetricsToPillars({
      summary: null,
      indebtedness: null,
    });

    expect(checkup.pillars.every((p) => p.state === 'inconclusive')).toBe(true);
    expect(checkup.pillars.every((p) => p.horizonLabel.trim().length > 0)).toBe(true);
  });

  it('maps critical liquidity and flow without inventing recommendations', () => {
    const summary = emptySummary();
    summary.balance = -5000;
    summary.income = 8000;
    summary.expenses = 13000;

    const indebtedness = sampleIndebtedness();
    indebtedness.liquidity.status = 'critical';
    indebtedness.liquidity.available = 500;

    const checkup = mapLiveMetricsToPillars({ summary, indebtedness });
    expect(checkup.hasCriticalBase).toBe(true);
    expect(checkup.closingSynthesis.toLowerCase()).not.toContain('recomend');
  });

  it('keeps user-facing copy free of internal jargon and ids', () => {
    const checkup = mapLiveMetricsToPillars({
      summary: emptySummary(),
      indebtedness: sampleIndebtedness(),
    });
    const copy = collectUserFacingCopy(checkup);

    expect(copy).not.toMatch(/\bproxy\b/i);
    expect(copy).not.toMatch(/\brunway\b/i);
    expect(copy).not.toMatch(/\bFIN-\d+/i);
    expect(copy).not.toMatch(/\bBEH-\d+/i);
  });

  it('declares human limitations when structure and wealth use partial readings', () => {
    const checkup = mapLiveMetricsToPillars({
      summary: emptySummary(),
      indebtedness: sampleIndebtedness(),
    });
    const structure = checkup.pillars.find((pillar) => pillar.id === 'structure');
    const wealth = checkup.pillars.find((pillar) => pillar.id === 'wealth');
    const resilience = checkup.pillars.find((pillar) => pillar.id === 'resilience');

    expect(structure?.hasGap).toBe(true);
    expect(structure?.exploreHint ?? '').toMatch(/leitura parcial|ainda incompleta/i);
    expect(wealth?.exploreHint ?? '').toMatch(/inventário|parcial|incompleta/i);
    expect(resilience?.exploreHint ?? '').toMatch(/estimativa|reserva marcada|parcial/i);
  });
});
