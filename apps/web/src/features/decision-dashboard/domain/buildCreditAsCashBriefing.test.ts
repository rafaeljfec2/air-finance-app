import { describe, expect, it } from 'vitest';

import { buildCreditAsCashBriefing } from './buildCreditAsCashBriefing';

describe('buildCreditAsCashBriefing', () => {
  it('uses short plain-language status lines without metaphor', () => {
    const copy = buildCreditAsCashBriefing({
      operationalCash: 44,
      projectedMonthBalance: 3832.52,
      anchorReceivable: {
        label: 'OUTSERA',
        amount: 21751.2,
        dueDay: 20,
        dueMonthShort: 'jul',
        dueDateShort: '20/07',
      },
      operatingCardName: 'ultraviolet-black MASTERCARD',
      operatingCardBillTotal: 11066,
      idleCardName: 'Signature',
    });

    expect(copy.statusLines).toEqual([
      'Hoje o dinheiro na conta está curto.',
      'No plano, o mês ainda pode fechar no positivo.',
      'Até a OUTSERA do dia 20, não use o cartão.',
    ]);
    expect(copy.status).not.toMatch(/travessia/i);
    expect(copy.evidence[0]?.value).toMatch(/R\$\s*44,00/);
    expect(copy.evidence[1]?.value).toMatch(/\+R\$\s*3\.832,52/);
    expect(copy.evidence[2]?.value).toMatch(/OUTSERA · R\$\s*21\.751,20 · dia 20/);
    expect(copy.decision).toMatch(/Ultraviolet nem o Signature/i);
  });

  it('falls back without inventing entity names', () => {
    const copy = buildCreditAsCashBriefing(undefined);
    expect(copy.statusLines[2]).toMatch(/próxima entrada/);
    expect(copy.decision).not.toMatch(/OUTSERA|Ultraviolet/i);
  });
});
