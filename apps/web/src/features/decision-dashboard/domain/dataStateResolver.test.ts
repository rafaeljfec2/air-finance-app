import { describe, expect, it } from 'vitest';

import type { DecisionDashboardSignals } from '@/types/decisionDashboard';

import { resolveDataState } from './dataStateResolver';

const baseSignals = (): DecisionDashboardSignals => ({
  hasAnyTransactions: false,
  hasPayables: false,
  hasReceivables: false,
  hasCreditPressure: false,
  income: 0,
  expenses: 0,
  balance: 0,
  isFirstAccess: false,
  readyForNext: false,
});

describe('resolveDataState', () => {
  it('returns first_access when flagged', () => {
    expect(resolveDataState({ ...baseSignals(), isFirstAccess: true })).toBe('first_access');
  });

  it('returns no_data when there are no movement or commitment signals', () => {
    expect(resolveDataState(baseSignals())).toBe('no_data');
  });

  it('returns sparse when only partial cycle signals exist', () => {
    expect(
      resolveDataState({
        ...baseSignals(),
        hasPayables: true,
        hasAnyTransactions: false,
      }),
    ).toBe('sparse');
  });

  it('returns sufficient when income or expenses and commitments support a decision', () => {
    expect(
      resolveDataState({
        ...baseSignals(),
        hasAnyTransactions: true,
        hasPayables: true,
        income: 1000,
        expenses: 400,
      }),
    ).toBe('sufficient');
  });

  it('returns advanced when readyForNext and data is sufficient', () => {
    expect(
      resolveDataState({
        ...baseSignals(),
        hasAnyTransactions: true,
        hasPayables: true,
        hasReceivables: true,
        income: 2000,
        expenses: 800,
        readyForNext: true,
      }),
    ).toBe('advanced');
  });
});
