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

  it('skips playback entirely when cached data is fresh at mount', () => {
    const { result } = renderHook(() =>
      useDashboardLoadingPlayback({
        companyId: 'company-1',
        enabled: true,
        dataReady: true,
        isRefreshing: false,
      }),
    );

    expect(result.current.isPlaybackActive).toBe(false);
    expect(result.current.loadingPhase).toBeNull();
  });

  it('runs playback on a cold load when data is not ready', () => {
    const { result, rerender } = renderHook(
      (props: { dataReady: boolean; isRefreshing: boolean }) =>
        useDashboardLoadingPlayback({
          companyId: 'company-1',
          enabled: true,
          dataReady: props.dataReady,
          isRefreshing: props.isRefreshing,
        }),
      { initialProps: { dataReady: false, isRefreshing: true } },
    );

    expect(result.current.isPlaybackActive).toBe(true);
    expect(result.current.loadingPhase?.message).toBe('Organizando movimentações');

    advanceLoadingSteps(1);

    expect(result.current.loadingPhase?.message).toBe('Entendendo entradas e saídas');

    rerender({ dataReady: true, isRefreshing: false });

    advanceLoadingSteps(DASHBOARD_LOADING_STEP_COUNT - 2);

    expect(result.current.loadingPhase?.message).toBe('Escrevendo seu parecer');

    advanceLoadingSteps(1);

    expect(result.current.isPlaybackActive).toBe(false);
    expect(result.current.loadingPhase).toBeNull();
  });

  it('runs playback when cache is stale and refetching at mount', () => {
    const { result } = renderHook(() =>
      useDashboardLoadingPlayback({
        companyId: 'company-1',
        enabled: true,
        dataReady: true,
        isRefreshing: true,
      }),
    );

    expect(result.current.isPlaybackActive).toBe(true);

    advanceLoadingSteps(DASHBOARD_LOADING_STEP_COUNT);

    expect(result.current.isPlaybackActive).toBe(false);
  });

  it('does not restart playback when a refetch starts while mounted', () => {
    const { result, rerender } = renderHook(
      (props: { isRefreshing: boolean }) =>
        useDashboardLoadingPlayback({
          companyId: 'company-1',
          enabled: true,
          dataReady: true,
          isRefreshing: props.isRefreshing,
        }),
      { initialProps: { isRefreshing: false } },
    );

    expect(result.current.isPlaybackActive).toBe(false);

    rerender({ isRefreshing: true });

    expect(result.current.isPlaybackActive).toBe(false);
  });

  it('holds on the last step until data becomes ready', () => {
    const { result, rerender } = renderHook(
      (props: { dataReady: boolean }) =>
        useDashboardLoadingPlayback({
          companyId: 'company-1',
          enabled: true,
          dataReady: props.dataReady,
          isRefreshing: !props.dataReady,
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

  it('restarts playback when company changes and the new company is loading', () => {
    const { result, rerender } = renderHook(
      (props: { companyId: string; dataReady: boolean }) =>
        useDashboardLoadingPlayback({
          companyId: props.companyId,
          enabled: true,
          dataReady: props.dataReady,
          isRefreshing: !props.dataReady,
        }),
      { initialProps: { companyId: 'company-1', dataReady: false } },
    );

    advanceLoadingSteps(2);

    rerender({ companyId: 'company-2', dataReady: false });

    expect(result.current.loadingPhase?.message).toBe('Organizando movimentações');
  });

  it('skips playback when company changes and its data is already fresh', () => {
    const { result, rerender } = renderHook(
      (props: { companyId: string; dataReady: boolean; isRefreshing: boolean }) =>
        useDashboardLoadingPlayback({
          companyId: props.companyId,
          enabled: true,
          dataReady: props.dataReady,
          isRefreshing: props.isRefreshing,
        }),
      { initialProps: { companyId: 'company-1', dataReady: false, isRefreshing: true } },
    );

    expect(result.current.isPlaybackActive).toBe(true);

    rerender({ companyId: 'company-2', dataReady: true, isRefreshing: false });

    expect(result.current.isPlaybackActive).toBe(false);
  });
});
