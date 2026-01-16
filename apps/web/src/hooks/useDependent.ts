import { useQuery } from '@tanstack/react-query';
import { getDependentById, type Dependent } from '../services/dependentService';

export const useDependent = (id: string) => {
  return useQuery<Dependent>({
    queryKey: ['dependent', id],
    queryFn: () => getDependentById(id),
    enabled: !!id,
  });
};
