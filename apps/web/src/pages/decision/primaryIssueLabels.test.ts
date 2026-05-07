import { describe, expect, it } from 'vitest';

import { PRIMARY_ISSUE_SLUGS } from '@/types/decisionEngine';

import {
  formatPrimaryIssueLabel,
  PRIMARY_ISSUE_LABELS_PT,
  problemHeadlineFromPrimaryIssue,
} from './primaryIssueLabels';

describe('PRIMARY_ISSUE_LABELS_PT', () => {
  it('defines a non-empty PT-BR label for every contract PrimaryIssueSlug', () => {
    expect(PRIMARY_ISSUE_SLUGS.length).toBeGreaterThanOrEqual(3);
    for (const slug of PRIMARY_ISSUE_SLUGS) {
      const label = PRIMARY_ISSUE_LABELS_PT[slug];
      expect(label.length).toBeGreaterThan(2);
      expect(label).not.toContain('_');
    }
  });
});

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

describe('problemHeadlineFromPrimaryIssue', () => {
  it('returns one brutal line per canonical slug', () => {
    expect(problemHeadlineFromPrimaryIssue('debt_pressure')).toBe(
      'Suas dívidas estão consumindo sua renda.',
    );
    expect(problemHeadlineFromPrimaryIssue('liquidity_risk')).toBe(
      'O caixa pode não aguentar o que vem pela frente.',
    );
    expect(problemHeadlineFromPrimaryIssue('credit_overuse')).toBe(
      'Crédito cheio aumenta o risco do mês fechar no vermelho.',
    );
    expect(problemHeadlineFromPrimaryIssue('high_commitment')).toBe(
      'Quase toda a renda já tem dono antes do mês acabar.',
    );
    expect(problemHeadlineFromPrimaryIssue('low_surplus')).toBe(
      'Sobra pouco para absorver um imprevisto.',
    );
    expect(problemHeadlineFromPrimaryIssue('low_savings')).toBe(
      'Está ficando pouco para o futuro ou para emergências.',
    );
    expect(problemHeadlineFromPrimaryIssue('high_fixed_cost')).toBe(
      'Muito do mês é conta fixa — grande parte é longa duração, com pouca margem para manobra rápida.',
    );
    expect(problemHeadlineFromPrimaryIssue('data_incomplete')).toBe(
      'Sem dados completos, qualquer conselho vira chute.',
    );
    expect(problemHeadlineFromPrimaryIssue('healthy')).toBe('Nada gritando alerta neste mês.');
  });

  it('returns fallback for empty or unknown slug', () => {
    expect(problemHeadlineFromPrimaryIssue('')).toBe(
      'Precisamos de mais contexto para ser diretos.',
    );
    expect(problemHeadlineFromPrimaryIssue('   ')).toBe(
      'Precisamos de mais contexto para ser diretos.',
    );
    expect(problemHeadlineFromPrimaryIssue('unknown_slug')).toBe(
      'Há um ponto de atenção neste mês.',
    );
  });
});
