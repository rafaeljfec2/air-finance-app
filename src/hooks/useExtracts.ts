import { useQuery } from '@tanstack/react-query';
import { getExtracts, ExtractResponse } from '@/services/transactionService';

export const useExtracts = (
  companyId: string,
  startDate: string,
  endDate: string,
  accountId?: string,
) =>
  useQuery<ExtractResponse[]>({
    queryKey: ['extracts', companyId, startDate, endDate, accountId],
    queryFn: () => getExtracts(companyId, startDate, endDate, accountId),
    enabled: !!companyId && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
