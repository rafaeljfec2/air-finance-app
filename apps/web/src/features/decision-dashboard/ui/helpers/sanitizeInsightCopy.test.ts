import { describe, expect, it } from 'vitest';

import { humanizeInsightCopy } from './sanitizeInsightCopy';

describe('humanizeInsightCopy', () => {
  it('replaces KPI / gravity-ladder engine prose with a human fallback', () => {
    const engineDump =
      "Prioridade pela escada de gravidade ( ): o primeiro eixo com indicadores fora do ideal foi 'custos fixos elevados'. Ordenação dos KPIs neste eixo ( ): alertas antes de atenção; KPIs considerados (ordenados): fixed_vs_variable_split.";
    const result = humanizeInsightCopy(engineDump);
    expect(result).not.toMatch(/KPI|fixed_vs_|escada|gravidade|eixo/i);
    expect(result.toLowerCase()).toMatch(/gesto|pressão|claro|alivia/);
  });

  it('keeps short human prose and softens ciclo wording', () => {
    expect(humanizeInsightCopy('Isso reduz a pressão do ciclo.')).toBe(
      'Isso reduz a pressão do mês.',
    );
  });

  it('returns fallback when only codes remain', () => {
    expect(humanizeInsightCopy('FP-1 FR-2 engine')).toMatch(/gesto|pressão|claro|alivia/i);
  });
});
