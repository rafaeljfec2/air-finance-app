import { describe, expect, it } from 'vitest';

import {
  displayOrderingRationaleForUser,
  isTechnicalOrderingRationale,
} from './displayOrderingRationaleForUser';

describe('isTechnicalOrderingRationale', () => {
  it('returns false for empty string', () => {
    expect(isTechnicalOrderingRationale('')).toBe(false);
  });

  it('returns false for short plain-language rationale', () => {
    expect(isTechnicalOrderingRationale('Priorizamos o que pesa mais no mês.')).toBe(false);
  });

  it('returns true when FR tags appear', () => {
    expect(
      isTechnicalOrderingRationale(
        "Prioridade pela escada de gravidade (FR-1): o primeiro eixo foi 'custos fixos elevados'.",
      ),
    ).toBe(true);
  });

  it('returns true when KPI inventory appears', () => {
    expect(
      isTechnicalOrderingRationale('KPIs considerados (ordenados): fixed_vs_variable_split.'),
    ).toBe(true);
  });
});

describe('displayOrderingRationaleForUser', () => {
  it('returns raw text when it is not technical', () => {
    const out = displayOrderingRationaleForUser('Resumo legível em uma linha.', 'high_fixed_cost');
    expect(out).toBe('Resumo legível em uma linha.');
  });

  it('returns Portuguese summary for technical rationale when primary issue is known', () => {
    const raw =
      "Prioridade pela escada de gravidade (FR-1): o primeiro eixo com indicadores fora do ideal foi 'custos fixos elevados'. KPIs considerados (ordenados): fixed_vs_variable_split.";
    const out = displayOrderingRationaleForUser(raw, 'high_fixed_cost');
    expect(out).toContain('despesas fixas');
    expect(out).not.toMatch(/FR-1/i);
    expect(out).not.toContain('fixed_vs_variable_split');
  });

  it('uses generic copy when technical but primary issue slug is unknown', () => {
    const raw = 'Ordenação dos KPIs neste eixo (FR-2): alertas antes de atenção.';
    const out = displayOrderingRationaleForUser(raw, 'unknown_slug');
    expect(out).toContain('priorizou');
    expect(out).not.toMatch(/FR-2/i);
  });
});
