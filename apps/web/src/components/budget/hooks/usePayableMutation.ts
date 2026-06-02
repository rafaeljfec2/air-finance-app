import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useTransactions } from '@/hooks/useTransactions';
import { useCompanyStore } from '@/stores/company';

import type { PayableUpdatePayload } from './payableUpdate.types';

export function invalidatePayableQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  companyId: string,
): void {
  queryClient.invalidateQueries({ queryKey: ['budget', companyId] });
  queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });
}

export function usePayableMutation() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const { updateTransactionAsync, isUpdating } = useTransactions(companyId);

  const updatePayable = useCallback(
    async (id: string, data: PayableUpdatePayload): Promise<void> => {
      await updateTransactionAsync({ id, data });
      if (companyId) {
        invalidatePayableQueries(queryClient, companyId);
      }
    },
    [companyId, queryClient, updateTransactionAsync],
  );

  return {
    updatePayable,
    isUpdating,
  };
}
