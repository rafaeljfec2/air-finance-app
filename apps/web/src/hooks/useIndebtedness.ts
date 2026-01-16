import { useQuery } from '@tanstack/react-query';
import type { IndebtednessMetrics } from '@/types/indebtedness';
import { getIndebtednessMetrics } from '@/services/indebtednessService';

export const useIndebtedness = (companyId: string) => {
  return useQuery<IndebtednessMetrics>({
    queryKey: ['indebtedness', companyId],
    queryFn: () => getIndebtednessMetrics(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

