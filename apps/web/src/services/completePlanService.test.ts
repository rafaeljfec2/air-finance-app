import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from './apiClient';
import { fetchCompletePlan } from './completePlanService';

vi.mock('./apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const samplePayload = {
  status: 'attention' as const,
  primary_issue: 'high_commitment',
  theme_phase: 'yellow' as const,
  diagnosis: 'd',
  numbers: {
    netIncome: 5000,
    totalCommitted: 1500,
    committedPct: 0.3,
    healthyTargetPct: 0.25,
    reductionNeeded: 250,
  },
  projection: {
    in30Days: { totalCommitted: 1500, committedPct: 0.3, installmentsEnding: 0 },
    in60Days: { totalCommitted: 1300, committedPct: 0.26, installmentsEnding: 1 },
    in90Days: { totalCommitted: 1100, committedPct: 0.22, installmentsEnding: 2 },
    ifNoChange: 'msg',
  },
  installmentsStrategy: {
    items: [
      {
        description: 'Compra X',
        monthlyValue: 800,
        remaining: 4,
        endDate: '2026-09-05',
        accountId: 'a',
        accountType: 'credit_card' as const,
        categoryId: null,
        priority: 'high' as const,
      },
    ],
    suggestion: 'sug',
  },
  behavior: {
    topCategories: [{ name: 'Alimentação', amount: 800, share: 0.4 }],
    peakDaysOfMonth: [5],
    creditUtilizationTrend: null,
  },
  personalRules: [{ id: 'a', text: 't', rationale: 'r' }],
  simpleRule: 'r',
  expectedOutcome: 'o',
  llmCached: false,
  ruleEngineVersion: '1.0.1',
};

describe('completePlanService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it('parses a complete payload from the API', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: samplePayload });

    const result = await fetchCompletePlan('company-1');

    expect(result.primary_issue).toBe('high_commitment');
    expect(result.installmentsStrategy.items).toHaveLength(1);
    expect(result.behavior.creditUtilizationTrend).toBeNull();
  });

  it('sends referencePeriod as query param when provided', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: samplePayload });

    await fetchCompletePlan('c1', { referencePeriod: '2026-05' });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/companies/c1/decision-engine/complete-plan',
      {},
      { params: { referencePeriod: '2026-05' } },
    );
  });

  it('rejects invalid payloads via Zod', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { ...samplePayload, numbers: { netIncome: 'not-a-number' } },
    });

    await expect(fetchCompletePlan('c1')).rejects.toBeDefined();
  });

  it('accepts null theme_phase for data_incomplete', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { ...samplePayload, primary_issue: 'data_incomplete', theme_phase: null },
    });

    const result = await fetchCompletePlan('c1');
    expect(result.theme_phase).toBeNull();
  });
});
