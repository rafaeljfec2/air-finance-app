import { useQuery } from '@tanstack/react-query';

import {
  evaluateAuto,
  type DecisionEngineEvaluateResponse,
} from '@/services/decisionEngineService';

export const decisionEngineEvaluateQueryKey = (companyId: string, referencePeriod?: string) =>
  ['decision-engine', 'evaluate-auto', companyId, referencePeriod ?? 'default'] as const;

export interface UseDecisionEngineEvaluateAutoOptions {
  readonly referencePeriod?: string;
  readonly enabled?: boolean;
  readonly staleTimeMs?: number;
}

export function useDecisionEngineEvaluateAuto(
  companyId: string,
  options?: UseDecisionEngineEvaluateAutoOptions,
) {
  const enabled = (options?.enabled ?? true) && companyId.length > 0;
  const referencePeriod =
    options?.referencePeriod !== undefined && options.referencePeriod.trim() !== ''
      ? options.referencePeriod.trim()
      : undefined;
  const evaluateOptions = referencePeriod !== undefined ? { referencePeriod } : undefined;

  return useQuery<DecisionEngineEvaluateResponse, Error>({
    queryKey: decisionEngineEvaluateQueryKey(companyId, referencePeriod),
    queryFn: () => evaluateAuto(companyId, evaluateOptions),
    enabled,
    staleTime: options?.staleTimeMs ?? 60_000,
  });
}
