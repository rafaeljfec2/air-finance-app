import { describe, expect, it } from 'vitest';

import { formatPrimaryIssueLabel } from './primaryIssueLabels';

describe('formatPrimaryIssueLabel', () => {
  it('returns PT-BR for canonical primary_issue slugs', () => {
    expect(formatPrimaryIssueLabel('liquidity_risk')).toBe('Risco de liquidez');
    expect(formatPrimaryIssueLabel('data_incomplete')).toBe('Dados incompletos');
    expect(formatPrimaryIssueLabel('healthy')).toBe('Situação saudável');
    expect(formatPrimaryIssueLabel('debt_pressure')).toBe('Pressão da dívida');
    expect(formatPrimaryIssueLabel('credit_overuse')).toBe('Uso excessivo de crédito');
    expect(formatPrimaryIssueLabel('high_commitment')).toBe('Renda muito comprometida');
    expect(formatPrimaryIssueLabel('low_surplus')).toBe('Pouca sobra prevista');
    expect(formatPrimaryIssueLabel('low_savings')).toBe('Poupança baixa');
    expect(formatPrimaryIssueLabel('high_fixed_cost')).toBe('Custos fixos altos');
  });

  it('returns default when slug is empty or whitespace', () => {
    expect(formatPrimaryIssueLabel('')).toBe('Sem foco definido');
    expect(formatPrimaryIssueLabel('   ')).toBe('Sem foco definido');
  });

  it('humanizes unknown slugs as fallback', () => {
    expect(formatPrimaryIssueLabel('future_theme_slug')).toBe('future theme slug');
  });

  it('matches catalog keys case-insensitively', () => {
    expect(formatPrimaryIssueLabel('LIQUIDITY_RISK')).toBe('Risco de liquidez');
  });
});
