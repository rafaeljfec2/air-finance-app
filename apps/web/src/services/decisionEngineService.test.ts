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
      theme_phase: 'yellow' as const,
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

  it('accepts theme_phase null for data_incomplete payloads', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        status: 'attention',
        primary_issue: 'data_incomplete',
        theme_phase: null,
        ordering_rationale: 'FR-0',
        actions: [
          {
            title: 'Complete dados',
            description: 'Vincule sua conta',
            impact: 'destrava o diagnóstico',
            reason: ['data_quality'],
          },
        ],
      },
    });

    const result = await evaluateAuto('c1');

    expect(result.theme_phase).toBeNull();
  });

  it('parses payload without theme_phase as undefined (backward compatible)', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        status: 'healthy',
        primary_issue: 'healthy',
        ordering_rationale: 'ok',
        actions: [],
      },
    });

    const result = await evaluateAuto('c1');

    expect(result.theme_phase).toBeUndefined();
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
