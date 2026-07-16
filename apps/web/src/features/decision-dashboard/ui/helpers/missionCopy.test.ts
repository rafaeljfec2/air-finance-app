import { describe, expect, it } from 'vitest';

import { buildCompanionCtaLabel, toMissionSupportLine } from './missionCopy';

describe('missionCopy helpers', () => {
  it('hides incomplete mid-clause support lines instead of truncating with ellipsis', () => {
    expect(toMissionSupportLine('Protege o ciclo hoje.', 88)).toBe('Protege o ciclo hoje.');
    expect(
      toMissionSupportLine(
        'financiamento de casa ou carro, aluguel e escola costumam ser rígidos demais neste mês',
        40,
      ),
    ).toBe('');
  });

  it('builds a companion CTA that never mirrors the full title', () => {
    const title = 'Priorize o pagamento crítico';
    const cta = buildCompanionCtaLabel(title);
    expect(cta).toBe('Quero priorizar isso');
    expect(cta).not.toBe(title);
    expect(buildCompanionCtaLabel('Ganhar folga no que ainda dá para mexer')).toBe(
      'Quero cuidar disso',
    );
  });
});
