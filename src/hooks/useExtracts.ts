import { useQuery } from '@tanstack/react-query';
import { getExtracts, ExtractResponse } from '@/services/transactionService';

export const useExtracts = (companyId: string, startDate: string, endDate: string) =>
  useQuery<ExtractResponse[]>({
    queryKey: ['extracts', companyId, startDate, endDate],
    queryFn: () => getExtracts(companyId, startDate, endDate),
    enabled: !!companyId && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
