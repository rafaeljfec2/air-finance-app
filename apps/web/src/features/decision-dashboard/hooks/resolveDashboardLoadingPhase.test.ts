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
  it('prioritizes movements when recent transactions are pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      recentTxLoading: true,
      summaryLoading: true,
    });

    expect(result.message).toBe('Organizando movimentações');
  });

  it('returns inflows and outflows message when summary is the first pending stage', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      summaryLoading: true,
      budgetLoading: true,
    });

    expect(result.message).toBe('Entendendo entradas e saídas');
  });

  it('returns commitments message when budget is pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      budgetLoading: true,
    });

    expect(result.message).toBe('Identificando compromissos');
  });

  it('returns financial pressure message when indebtedness is pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      indebtednessLoading: true,
    });

    expect(result.message).toBe('Avaliando pressão financeira');
  });

  it('returns history patterns message when expenses by category are pending', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      expensesLoading: true,
    });

    expect(result.message).toBe('Cruzando padrões do histórico');
  });

  it('returns report writing fallback when no core stage is pending', () => {
    const result = resolveDashboardLoadingPhase(idle);

    expect(result.message).toBe('Escrevendo seu parecer');
  });

  it('marks earlier steps as done and the current one as active', () => {
    const result = resolveDashboardLoadingPhase({
      ...idle,
      summaryLoading: true,
      budgetLoading: true,
    });

    expect(result.steps.map((step) => step.status)).toEqual([
      'done',
      'active',
      'pending',
      'pending',
      'pending',
      'pending',
    ]);
  });

  it('exposes a description for every step', () => {
    const result = resolveDashboardLoadingPhase(idle);

    for (const step of result.steps) {
      expect(step.description.length).toBeGreaterThan(0);
    }
  });

  it('builds playback phases from a fixed step index', () => {
    const result = resolveDashboardLoadingPhaseFromIndex(2);

    expect(result.message).toBe('Identificando compromissos');
    expect(result.steps.map((step) => step.status)).toEqual([
      'done',
      'done',
      'active',
      'pending',
      'pending',
      'pending',
    ]);
  });
});
