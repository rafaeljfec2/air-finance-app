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
}

export interface UseDashboardLoadingPlaybackResult {
  readonly isPlaybackActive: boolean;
  readonly loadingPhase: DashboardLoadingPhase | null;
}

export function useDashboardLoadingPlayback({
  companyId,
  enabled,
  dataReady,
}: UseDashboardLoadingPlaybackInput): UseDashboardLoadingPlaybackResult {
  const [stepIndex, setStepIndex] = useState(0);
  const [playbackComplete, setPlaybackComplete] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setPlaybackComplete(false);
  }, [companyId]);

  useEffect(() => {
    if (!enabled || playbackComplete) {
      return undefined;
    }

    const isLastStep = stepIndex >= DASHBOARD_LOADING_STEP_COUNT - 1;

    if (isLastStep) {
      if (!dataReady) {
        return undefined;
      }

      const timer = window.setTimeout(() => {
        setPlaybackComplete(true);
      }, DASHBOARD_LOADING_STEP_MIN_MS);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setStepIndex((current) => current + 1);
    }, DASHBOARD_LOADING_STEP_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, playbackComplete, stepIndex, dataReady]);

  const isPlaybackActive = enabled && !playbackComplete;
  const loadingPhase = isPlaybackActive ? resolveDashboardLoadingPhaseFromIndex(stepIndex) : null;

  return {
    isPlaybackActive,
    loadingPhase,
  };
}
