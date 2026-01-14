import { useQuery } from '@tanstack/react-query';
import { getLoanById, type Loan } from '../services/loanService';

export const useLoan = (id: string) => {
  return useQuery<Loan>({
    queryKey: ['loans', id],
    queryFn: () => getLoanById(id),
    enabled: !!id,
  });
};
