import { useQuery } from '@tanstack/react-query';
import { getInvestmentById, Investment } from '../services/investmentService';

export const useInvestment = (id: string) => {
  return useQuery<Investment>({
    queryKey: ['investment', id],
    queryFn: () => getInvestmentById(id),
    enabled: !!id,
  });
};
