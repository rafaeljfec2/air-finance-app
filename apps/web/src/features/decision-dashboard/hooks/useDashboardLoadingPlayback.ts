import { useEffect, useState } from 'react';

import {
  DASHBOARD_LOADING_STEP_COUNT,
  DASHBOARD_LOADING_STEP_MIN_MS,
  resolveDashboardLoadingPhaseFromIndex,
  type DashboardLoadingPhase,
} from './resolveDashboardLoadingPhase';

export interface UseDashboardLoadingPlaybackInput {
  readonly companyId: string;
  readonly enabled: boolean;
  readonly dataReady: boolean;
  readonly isRefreshing: boolean;
}

export interface UseDashboardLoadingPlaybackResult {
  readonly isPlaybackActive: boolean;
  readonly loadingPhase: DashboardLoadingPhase | null;
}

interface PlaybackState {
  readonly companyId: string;
  readonly stepIndex: number;
  readonly complete: boolean;
}

export function useDashboardLoadingPlayback({
  companyId,
  enabled,
  dataReady,
  isRefreshing,
}: UseDashboardLoadingPlaybackInput): UseDashboardLoadingPlaybackResult {
  // Playback only runs when data is actually being fetched at the moment the
  // surface (or a new company) mounts: full page refresh, cold cache, or
  // stale cache being revalidated. Fresh cached data renders instantly.
  const hasFreshData = dataReady && !isRefreshing;

  const [playback, setPlayback] = useState<PlaybackState>(() => ({
    companyId,
    stepIndex: 0,
    complete: hasFreshData,
  }));

  if (playback.companyId !== companyId) {
    setPlayback({ companyId, stepIndex: 0, complete: hasFreshData });
  }

  useEffect(() => {
    if (!enabled || playback.complete) {
      return undefined;
    }

    const isLastStep = playback.stepIndex >= DASHBOARD_LOADING_STEP_COUNT - 1;

    if (isLastStep) {
      if (!dataReady) {
        return undefined;
      }

      const timer = window.setTimeout(() => {
        setPlayback((current) => ({ ...current, complete: true }));
      }, DASHBOARD_LOADING_STEP_MIN_MS);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setPlayback((current) => ({ ...current, stepIndex: current.stepIndex + 1 }));
    }, DASHBOARD_LOADING_STEP_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, playback.complete, playback.stepIndex, dataReady]);

  const isPlaybackActive = enabled && !playback.complete;
  const loadingPhase = isPlaybackActive
    ? resolveDashboardLoadingPhaseFromIndex(playback.stepIndex)
    : null;

  return {
    isPlaybackActive,
    loadingPhase,
  };
}
