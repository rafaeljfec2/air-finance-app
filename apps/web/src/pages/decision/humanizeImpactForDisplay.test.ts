import { describe, expect, it } from 'vitest';

import { humanizeImpactForDisplay } from './humanizeImpactForDisplay';

describe('humanizeImpactForDisplay', () => {
  it('rewrites typical savings interest pattern in human PT', () => {
    expect(
      humanizeImpactForDisplay(
        'Economia típica **R$ 2.731,00/mês** em juros se taxa cair **5 p.p.**',
      ),
    ).toBe('Você pode economizar cerca de R$ 2.731,00/mês.');
  });

  it('handles economy line without trailing juros clause', () => {
    expect(humanizeImpactForDisplay('Economia típica **R$ 120/mês**.')).toBe(
      'Você pode economizar cerca de R$ 120/mês.',
    );
  });

  it('rewrites Libera até percentage pattern', () => {
    expect(humanizeImpactForDisplay('Libera até **15%** da renda para caixa.')).toBe(
      'Você pode liberar cerca de 15% da renda para o caixa.',
    );
  });

  it('strips markdown bold for other strings', () => {
    expect(humanizeImpactForDisplay('Mesmo **R$ 50/mês** já ajuda.')).toBe(
      'Mesmo R$ 50/mês já ajuda.',
    );
  });

  it('returns empty for whitespace only', () => {
    expect(humanizeImpactForDisplay('   ')).toBe('');
  });
});
