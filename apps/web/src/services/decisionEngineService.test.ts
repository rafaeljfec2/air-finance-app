import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from './apiClient';
import { evaluateAuto } from './decisionEngineService';

vi.mock('./apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('decisionEngineService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it('posts evaluate-auto and returns validated payload', async () => {
    const payload = {
      status: 'attention' as const,
      primary_issue: 'liquidity_risk',
      ordering_rationale: 'Test rationale',
      actions: [
        {
          title: 'Build buffer',
          description: 'Increase runway',
          impact: 'high',
          reason: ['checking_runway_days'],
        },
      ],
      ruleEngineVersion: '1.0.0',
    };
    vi.mocked(apiClient.post).mockResolvedValue({ data: payload });

    const result = await evaluateAuto('company-1');

    expect(apiClient.post).toHaveBeenCalledWith(
      '/companies/company-1/decision-engine/evaluate-auto',
      {},
      {},
    );
    expect(result).toEqual(payload);
  });

  it('sends referencePeriod as query param when provided', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        status: 'healthy',
        primary_issue: 'healthy',
        ordering_rationale: 'ok',
        actions: [],
      },
    });

    await evaluateAuto('c1', { referencePeriod: '2026-01' });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/companies/c1/decision-engine/evaluate-auto',
      {},
      { params: { referencePeriod: '2026-01' } },
    );
  });
});
