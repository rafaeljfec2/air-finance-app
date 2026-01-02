import { subscriptionService, type PlanPermissions } from '@/services/subscriptionService';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to get user plan permissions from backend
 * Security: Always fetches from backend to prevent client-side manipulation
 */
export function usePlanPermissions() {
  const {
    data: permissions,
    isLoading,
    error,
  } = useQuery<PlanPermissions>({
    queryKey: ['plan-permissions'],
    queryFn: () => subscriptionService.getMyPermissions(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  // Fallback to free plan if error or loading
  const defaultPermissions: PlanPermissions = {
    plan: 'free',
    canCreateMultipleCompanies: false,
    canUseAI: false,
    canUseBankIntegration: false,
    canUseMultiUser: false,
    maxAccounts: 2,
    maxCards: 2,
  };

  return {
    ...(permissions ?? defaultPermissions),
    isLoading,
    error,
  };
}
