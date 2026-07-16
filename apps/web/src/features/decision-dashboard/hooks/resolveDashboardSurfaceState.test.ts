import { describe, expect, it } from 'vitest';

import { resolveDashboardSurfaceState } from './resolveDashboardSurfaceState';

const readyCore = {
  companyId: 'c1',
  summaryLoading: false,
  budgetLoading: false,
  recentTxLoading: false,
  expensesLoading: false,
  indebtednessLoading: false,
  summaryError: false,
  budgetError: false,
  recentTxError: false,
  hasSummaryData: true,
} as const;

describe('resolveDashboardSurfaceState', () => {
  it('returns awaiting_company when companyId is empty', () => {
    expect(resolveDashboardSurfaceState({ ...readyCore, companyId: '' })).toBe('awaiting_company');
  });

  it('returns ready when core queries succeed even if engine would fail', () => {
    expect(resolveDashboardSurfaceState(readyCore)).toBe('ready');
  });

  it('returns loading while core queries load', () => {
    expect(
      resolveDashboardSurfaceState({ ...readyCore, summaryLoading: true, hasSummaryData: false }),
    ).toBe('loading');
  });

  it('returns error only for core query failures', () => {
    expect(
      resolveDashboardSurfaceState({ ...readyCore, summaryError: true, hasSummaryData: false }),
    ).toBe('error');
  });
});
