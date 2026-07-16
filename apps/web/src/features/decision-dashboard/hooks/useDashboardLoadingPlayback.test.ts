import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DASHBOARD_LOADING_STEP_COUNT,
  DASHBOARD_LOADING_STEP_MIN_MS,
} from './resolveDashboardLoadingPhase';
import { useDashboardLoadingPlayback } from './useDashboardLoadingPlayback';

function advanceLoadingSteps(stepCount: number): void {
  for (let step = 0; step < stepCount; step += 1) {
    act(() => {
      vi.advanceTimersByTime(DASHBOARD_LOADING_STEP_MIN_MS);
    });
  }
}

describe('useDashboardLoadingPlayback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances through all steps even when data is already ready', () => {
    const { result } = renderHook(() =>
      useDashboardLoadingPlayback({
        companyId: 'company-1',
        enabled: true,
        dataReady: true,
      }),
    );

    expect(result.current.isPlaybackActive).toBe(true);
    expect(result.current.loadingPhase?.message).toBe('Organizando movimentações');

    advanceLoadingSteps(1);

    expect(result.current.loadingPhase?.message).toBe('Entendendo entradas e saídas');

    advanceLoadingSteps(DASHBOARD_LOADING_STEP_COUNT - 2);

    expect(result.current.loadingPhase?.message).toBe('Escrevendo seu parecer');

    advanceLoadingSteps(1);

    expect(result.current.isPlaybackActive).toBe(false);
    expect(result.current.loadingPhase).toBeNull();
  });

  it('holds on the last step until data becomes ready', () => {
    const { result, rerender } = renderHook(
      (props: { dataReady: boolean }) =>
        useDashboardLoadingPlayback({
          companyId: 'company-1',
          enabled: true,
          dataReady: props.dataReady,
        }),
      { initialProps: { dataReady: false } },
    );

    advanceLoadingSteps(DASHBOARD_LOADING_STEP_COUNT - 1);

    expect(result.current.loadingPhase?.message).toBe('Escrevendo seu parecer');
    expect(result.current.isPlaybackActive).toBe(true);

    advanceLoadingSteps(1);

    expect(result.current.isPlaybackActive).toBe(true);

    rerender({ dataReady: true });

    advanceLoadingSteps(1);

    expect(result.current.isPlaybackActive).toBe(false);
  });

  it('resets playback when company changes', () => {
    const { result, rerender } = renderHook(
      (props: { companyId: string }) =>
        useDashboardLoadingPlayback({
          companyId: props.companyId,
          enabled: true,
          dataReady: true,
        }),
      { initialProps: { companyId: 'company-1' } },
    );

    advanceLoadingSteps(2);

    rerender({ companyId: 'company-2' });

    expect(result.current.loadingPhase?.message).toBe('Organizando movimentações');
  });
});
