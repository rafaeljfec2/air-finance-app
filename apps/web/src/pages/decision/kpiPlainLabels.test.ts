import { describe, expect, it } from 'vitest';

import { formatActionReasonsPlain } from './kpiPlainLabels';

describe('formatActionReasonsPlain', () => {
  it('maps known KPI ids to short PT phrases', () => {
    expect(formatActionReasonsPlain(['debt_service_to_income'])).toBe('Compromisso com dívidas');
    expect(formatActionReasonsPlain(['income_committed_pct', 'monthly_cash_flow'])).toBe(
      'Renda comprometida · Sobra no mês',
    );
  });

  it('limits to three items and uses middle dot', () => {
    const long = ['a', 'b', 'c', 'd'];
    expect(formatActionReasonsPlain(long)).toBe('a · b · c');
  });

  it('returns empty string for empty reasons', () => {
    expect(formatActionReasonsPlain([])).toBe('');
  });
});
