import { useQuery } from '@tanstack/react-query';

import { fetchCompletePlan, type CompletePlanResponse } from '@/services/completePlanService';

export const completePlanQueryKey = (companyId: string, referencePeriod?: string) =>
  ['decision-engine', 'complete-plan', companyId, referencePeriod ?? 'default'] as const;

export interface UseCompletePlanOptions {
  readonly referencePeriod?: string;
  readonly enabled?: boolean;
}

const DEFAULT_STALE_MS = 5 * 60 * 1000;
const DEFAULT_GC_MS = 30 * 60 * 1000;

export function useCompletePlan(companyId: string, options?: UseCompletePlanOptions) {
  const enabled = (options?.enabled ?? true) && companyId.length > 0;
  const referencePeriod =
    options?.referencePeriod !== undefined && options.referencePeriod.trim() !== ''
      ? options.referencePeriod.trim()
      : undefined;
  const fetchOptions = referencePeriod !== undefined ? { referencePeriod } : undefined;

  return useQuery<CompletePlanResponse, Error>({
    queryKey: completePlanQueryKey(companyId, referencePeriod),
    queryFn: () => fetchCompletePlan(companyId, fetchOptions),
    enabled,
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });
}
