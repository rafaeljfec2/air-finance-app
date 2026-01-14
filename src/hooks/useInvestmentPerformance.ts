import { useQuery } from '@tanstack/react-query';
import { getInvestmentPerformance } from '../services/investmentService';

interface InvestmentPerformance {
  [key: string]: unknown;
}

export const useInvestmentPerformance = (id: string, startDate: string, endDate: string) => {
  return useQuery<InvestmentPerformance>({
    queryKey: ['investment-performance', id, startDate, endDate],
    queryFn: () => getInvestmentPerformance(id, startDate, endDate),
    enabled: !!id && !!startDate && !!endDate,
  });
};
