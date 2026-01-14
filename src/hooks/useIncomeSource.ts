import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { getIncomeSourceById, type IncomeSource } from '../services/incomeSourceService';

export const useIncomeSource = (companyId: string, id: string) => {
  return useQuery<IncomeSource, ReactNode>({
    queryKey: ['income-source', companyId, id],
    queryFn: () => getIncomeSourceById(companyId, id),
    enabled: !!companyId && !!id,
  });
};
