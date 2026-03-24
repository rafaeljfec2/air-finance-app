import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { toast } from '@/components/ui/toast';
import { useTransactions } from '@/hooks/useTransactions';
import { useCompanyStore } from '@/stores/company';
import type { Payable } from '@/types/budget';

const CREDIT_CARD_ID_PREFIX = 'card-';

function isToggleable(id: string): boolean {
  return !id.startsWith(CREDIT_CARD_ID_PREFIX);
}

export function usePayableStatus() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const { updateTransaction } = useTransactions(companyId);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleStatus = async (id: string, currentStatus: Payable['status']) => {
    if (!isToggleable(id) || togglingId) return;

    const newReconciled = currentStatus !== 'PAID';
    setTogglingId(id);

    try {
      await Promise.resolve(
        updateTransaction({
          id,
          data: { reconciled: newReconciled },
        }),
      );

      queryClient.invalidateQueries({ queryKey: ['budget', companyId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });

      toast({
        title: newReconciled ? 'Marcado como pago' : 'Marcado como pendente',
        description: 'Status atualizado com sucesso.',
        type: 'success',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao atualizar status',
        description: `Não foi possível atualizar o status: ${errorMessage}`,
        type: 'error',
      });
    } finally {
      setTogglingId(null);
    }
  };

  return {
    togglingId,
    isToggleable,
    toggleStatus,
  };
}
