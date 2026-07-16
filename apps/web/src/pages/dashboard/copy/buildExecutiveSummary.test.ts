import { describe, expect, it } from 'vitest';

import type { CapacityState, FinancialHealthCheckup, FinancialHealthPillar } from '../types';

import { buildExecutiveSummary } from './buildExecutiveSummary';

function pillar(
  partial: Pick<FinancialHealthPillar, 'id' | 'name' | 'state'> & Partial<FinancialHealthPillar>,
): FinancialHealthPillar {
  return {
    question: 'Pergunta?',
    primaryLabel: 'Métrica',
    primaryValue: null,
    primaryFormatted: null,
    interpretation: 'Interpretação longa.',
    influencers: { improves: ['a'], worsens: ['b'] },
    connections: ['x'],
    summarySentence: 'Resumo.',
    hasGap: false,
    exploreHint: null,
    ...partial,
  };
}

function checkup(
  states: Record<string, CapacityState>,
  hasCriticalBase = false,
): FinancialHealthCheckup {
  const order = [
    ['liquidity', 'Liquidez'],
    ['flow', 'Fluxo'],
    ['structure', 'Estrutura'],
    ['credit', 'Crédito'],
    ['resilience', 'Resiliência'],
    ['wealth', 'Patrimônio'],
  ] as const;

  return {
    surfaceQuestion: 'Qual é a capacidade financeira do meu sistema?',
    hasCriticalBase,
    closingSynthesis: 'Síntese de fechamento existente.',
    pillars: order.map(([id, name]) =>
      pillar({
        id,
        name,
        state: states[id] ?? 'good',
      }),
    ),
  };
}

describe('buildExecutiveSummary', () => {
  it('describes good operational capacity and names primary tension pillar', () => {
    const lines = buildExecutiveSummary(
      checkup({
        liquidity: 'good',
        flow: 'excellent',
        structure: 'critical',
        credit: 'excellent',
        resilience: 'excellent',
        wealth: 'attention',
      }),
    );

    expect(lines.capacityLine.toLowerCase()).toContain('capacidade');
    expect(lines.capacityLine.toLowerCase()).toMatch(/boa|sustentável/);
    expect(lines.tensionLine).toContain('Estrutura');
    expect(lines.supportLine.toLowerCase()).toMatch(/demais|sustentar|sustentam/);
    expect(lines.capacityLine.toLowerCase()).not.toContain('recomend');
  });

  it('prioritizes critical base when liquidez/fluxo are critical', () => {
    const lines = buildExecutiveSummary(
      checkup(
        {
          liquidity: 'critical',
          flow: 'attention',
          structure: 'good',
          credit: 'good',
          resilience: 'good',
          wealth: 'good',
        },
        true,
      ),
    );

    expect(lines.capacityLine.toLowerCase()).toMatch(/pressão|base|crítica|critico/);
    expect(lines.tensionLine.toLowerCase()).toMatch(/liquidez|fluxo/);
  });

  it('handles inconclusive majority without inventing excellent', () => {
    const lines = buildExecutiveSummary(
      checkup({
        liquidity: 'inconclusive',
        flow: 'inconclusive',
        structure: 'inconclusive',
        credit: 'good',
        resilience: 'inconclusive',
        wealth: 'inconclusive',
      }),
    );

    expect(lines.capacityLine.toLowerCase()).toMatch(/parcial|inconclusiv|lacuna/);
    expect(lines.capacityLine.toLowerCase()).not.toContain('excelente');
  });
});
