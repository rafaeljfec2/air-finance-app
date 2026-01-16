import { useQuery } from '@tanstack/react-query';
import { getLoanAmortization } from '../services/loanService';

interface LoanAmortization {
  [key: string]: unknown;
}

export const useLoanAmortization = (id: string) => {
  return useQuery<LoanAmortization>({
    queryKey: ['loans', id, 'amortization'],
    queryFn: () => getLoanAmortization(id),
    enabled: !!id,
  });
};
