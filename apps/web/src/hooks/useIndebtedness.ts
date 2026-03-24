import { useQuery } from '@tanstack/react-query';

import { getIndebtednessMetrics } from '@/services/indebtednessService';
import type { IndebtednessMetrics } from '@/types/indebtedness';


export const useIndebtedness = (companyId: string) => {
  return useQuery<IndebtednessMetrics>({
    queryKey: ['indebtedness', companyId],
    queryFn: () => getIndebtednessMetrics(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
