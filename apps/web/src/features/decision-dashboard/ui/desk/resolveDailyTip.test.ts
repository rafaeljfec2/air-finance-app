import { describe, expect, it } from 'vitest';

import { resolveDailyTip } from './resolveDailyTip';

describe('resolveDailyTip', () => {
  it('returns the fallback tip when summary is missing', () => {
    expect(resolveDailyTip(null)).toBe(
      'Pequenas decisões diárias constroem grandes resultados mensais.',
    );
  });

  it('warns when expenses exceed income', () => {
    expect(resolveDailyTip({ income: 1000, expenses: 1500, balance: -500 })).toMatch(
      /saídas|despesas/i,
    );
  });

  it('encourages when balance is positive', () => {
    expect(resolveDailyTip({ income: 2000, expenses: 1000, balance: 1000 })).toMatch(
      /positivo|folga|caminho/i,
    );
  });
});
