import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as decisionEngineService from '@/services/decisionEngineService';

import { useDecisionEngineEvaluateAuto } from '../useDecisionEngineEvaluateAuto';

vi.mock('@/services/decisionEngineService', () => ({
  evaluateAuto: vi.fn(),
}));

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

describe('useDecisionEngineEvaluateAuto', () => {
  beforeEach(() => {
    vi.mocked(decisionEngineService.evaluateAuto).mockReset();
  });

  it('does not fetch when companyId is empty', () => {
    const { wrapper } = createTestWrapper();
    const { result } = renderHook(() => useDecisionEngineEvaluateAuto(''), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
    expect(decisionEngineService.evaluateAuto).not.toHaveBeenCalled();
  });

  it('fetches evaluate-auto when companyId is set', async () => {
    const payload = {
      status: 'attention' as const,
      primary_issue: 'liquidity_risk',
      ordering_rationale: 'Test',
      actions: [
        {
          title: 'Reserve',
          description: 'Build cushion',
          impact: 'high',
          reason: ['checking_runway_days'],
        },
      ],
    };
    vi.mocked(decisionEngineService.evaluateAuto).mockResolvedValue(payload);

    const { wrapper } = createTestWrapper();
    const { result } = renderHook(() => useDecisionEngineEvaluateAuto('company-99'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(decisionEngineService.evaluateAuto).toHaveBeenCalledWith('company-99', undefined);
    expect(result.current.data).toEqual(payload);
  });

  it('passes referencePeriod to evaluateAuto', async () => {
    vi.mocked(decisionEngineService.evaluateAuto).mockResolvedValue({
      status: 'healthy',
      primary_issue: 'healthy',
      ordering_rationale: 'ok',
      actions: [],
    });

    const { wrapper } = createTestWrapper();
    const { result } = renderHook(
      () =>
        useDecisionEngineEvaluateAuto('c2', {
          referencePeriod: '2026-04',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(decisionEngineService.evaluateAuto).toHaveBeenCalledWith('c2', {
      referencePeriod: '2026-04',
    });
  });
});
