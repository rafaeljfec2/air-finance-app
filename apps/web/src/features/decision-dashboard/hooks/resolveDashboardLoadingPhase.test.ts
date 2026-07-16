import { describe, expect, it } from 'vitest';

import {
  resolveDashboardLoadingPhase,
  resolveDashboardLoadingPhaseFromIndex,
} from './resolveDashboardLoadingPhase';

const idle = {
  summaryLoading: false,
  budgetLoading: false,
  recentTxLoading: false,
  expensesLoading: false,
  indebtednessLoading: false,
} as const;

describe('resolveDashboardLoadingPhase', () => {
  it('prioritizes budget and accounts when that stage is pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      budgetLoading: true,
      summaryLoading: true,
    });

    expect(result.message).toBe('Organizando contas e planejamento do mês…');
  });

  it('returns summary message when summary is the first pending stage', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      summaryLoading: true,
      recentTxLoading: true,
    });

    expect(result.message).toBe('Lendo entradas, saídas e saldo do mês…');
  });

  it('returns movements message when recent transactions are pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      recentTxLoading: true,
    });

    expect(result.message).toBe('Revisando movimentações recentes…');
  });

  it('returns movements message when expenses by category are pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      expensesLoading: true,
    });

    expect(result.message).toBe('Revisando movimentações recentes…');
  });

  it('returns credit pressure message when indebtedness is pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      indebtednessLoading: true,
    });

    expect(result.message).toBe('Verificando pressão de crédito…');
  });

  it('returns assembly fallback when no core stage is pending', () => {
    const result = resolveDashboardLoadingPhase(idle);

    expect(result.message).toBe('Montando seu parecer de hoje…');
  });

  it('marks earlier steps as done and the current one as active', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      summaryLoading: true,
      recentTxLoading: true,
    });

    expect(result.steps.map((step) => step.status)).toEqual([
      'done',
      'active',
      'pending',
      'pending',
      'pending',
    ]);
  });

  it('builds playback phases from a fixed step index', () => {
    const result = resolveDashboardLoadingPhaseFromIndex(2);

    expect(result.message).toBe('Revisando movimentações recentes…');
    expect(result.steps.map((step) => step.status)).toEqual([
      'done',
      'done',
      'active',
      'pending',
      'pending',
    ]);
  });
});
