import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { createAccount, type CreateAccount } from '@/services/accountService';
import { createItem } from '@/services/openiService';
import { useAccounts } from '@/hooks/useAccounts';
import { processConflictError } from './handlers/openiStatusHandlers';
import type { ModalStep } from './handlers/openiStatusHandlers';

interface UseOpenFinanceMutationsParams {
  companyId: string;
  onSuccess?: () => void;
  setCreatedAccountId: (id: string | null) => void;
  setCreatedItemId: (id: string | null) => void;
  setStep: (step: ModalStep) => void;
}

export const useOpenFinanceMutations = ({
  companyId,
  onSuccess,
  setCreatedAccountId,
  setCreatedItemId,
  setStep,
}: UseOpenFinanceMutationsParams) => {
  const queryClient = useQueryClient();
  const { accounts } = useAccounts();

  const createAccountMutation = useMutation({
    mutationFn: async (accountData: CreateAccount) => {
      return createAccount(companyId, accountData);
    },
    onSuccess: (account) => {
      setCreatedAccountId(account.id);
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message ?? 'Erro ao criar conta';
      toast.error(errorMessage);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async ({
      accountId,
      connectorId,
      parameters,
    }: {
      accountId?: string;
      connectorId: string;
      parameters: Record<string, string>;
    }) => {
      return createItem(companyId, accountId, { connectorId, parameters });
    },
    onSuccess: async (item) => {
      console.log('[OpenFinanceModal] Item created:', { item });
      setCreatedItemId(item.id);
      setStep('oauth-waiting');

      if (item.status === 'PENDING' || item.status === 'pending') {
        console.log('[OpenFinanceModal] Status is PENDING, will poll until waiting_user_input...');
        toast.info('Aguardando preparação da autenticação...');
      } else if (item.status === 'WAITING_USER_INPUT' || item.status === 'waiting_user_input') {
        console.log('[OpenFinanceModal] Status is WAITING_USER_INPUT, opening auth URL...');
        if (item.auth?.authUrl) {
          window.open(item.auth.authUrl, '_blank');
          toast.info('Redirecionando para autenticação...');
        } else {
          console.warn('[OpenFinanceModal] No authUrl found in item');
        }
      } else if (
        item.status === 'CONNECTED' ||
        item.status === 'connected' ||
        item.status === 'SYNCING' ||
        item.status === 'syncing' ||
        item.status === 'SYNCED' ||
        item.status === 'synced'
      ) {
        const message =
          item.status === 'SYNCING' || item.status === 'syncing'
            ? 'Conexão estabelecida! Sincronizando contas...'
            : 'Conexão estabelecida com sucesso!';
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccess?.();
      }
    },
    onError: async (error: unknown, variables) => {
      processConflictError({
        error,
        context: { variables, accounts, companyId },
        queryClient,
        onSuccess,
        setCreatedItemId,
        setStep,
      });
    },
  });

  return {
    createAccountMutation,
    createItemMutation,
  };
};
