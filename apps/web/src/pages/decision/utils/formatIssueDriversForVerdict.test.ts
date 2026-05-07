import { describe, expect, it } from 'vitest';

import {
  formatKpiValueForVerdict,
  summarizeIssueDriversForVerdict,
} from './formatIssueDriversForVerdict';

describe('formatKpiValueForVerdict', () => {
  it('formats ratio KPIs as percent', () => {
    expect(formatKpiValueForVerdict('fixed_vs_variable_split', 0.42)).toBe('42%');
  });

  it('formats runway as whole days', () => {
    expect(formatKpiValueForVerdict('checking_runway_days', 33.7)).toBe('34 dias');
  });

  it('formats monthly cash flow as BRL', () => {
    const out = formatKpiValueForVerdict('monthly_cash_flow', -1500);
    expect(out).toMatch(/1\.500/);
    expect(out).toMatch(/R\$/);
  });

  it('returns null when value is missing', () => {
    expect(formatKpiValueForVerdict('savings_rate', null)).toBeNull();
  });
});

describe('summarizeIssueDriversForVerdict', () => {
  it('returns empty string for empty drivers', () => {
    expect(summarizeIssueDriversForVerdict([])).toBe('');
  });

  it('joins label and formatted value with middle dot', () => {
    const line = summarizeIssueDriversForVerdict([
      { kpi_id: 'fixed_vs_variable_split', level: 'warn', value: 0.42 },
    ]);
    expect(line).toContain('Peso das contas fixas');
    expect(line).toContain('42%');
  });
});
