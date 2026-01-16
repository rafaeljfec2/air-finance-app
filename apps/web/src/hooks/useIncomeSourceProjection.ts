import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { getIncomeSourceProjection } from '../services/incomeSourceService';

interface IncomeSourceProjection {
  [key: string]: unknown;
}

export const useIncomeSourceProjection = (companyId: string, id: string) => {
  return useQuery<IncomeSourceProjection, ReactNode>({
    queryKey: ['income-source-projection', companyId, id],
    queryFn: () => getIncomeSourceProjection(companyId, id),
    enabled: !!companyId && !!id,
  });
};
