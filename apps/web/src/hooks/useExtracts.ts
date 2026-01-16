import { ExtractResponse, getExtracts } from '@/services/transactionService';
import { useQuery } from '@tanstack/react-query';

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
    staleTime: 0, // Always fetch fresh data since this is an import/review page
  });
