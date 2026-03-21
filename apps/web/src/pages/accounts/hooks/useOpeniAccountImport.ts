import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useEffect } from 'react';

import { toast } from '@/components/ui/toast';
import { getAccounts, importAccounts } from '@/services/openiService';

interface UseOpeniAccountImportParams {
  companyId: string;
  onSuccess?: () => void;
}

export const useOpeniAccountImport = ({ companyId, onSuccess }: UseOpeniAccountImportParams) => {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const handleSuccessfulImport = useCallback(
    (importResult: { data: { imported: number } }, status: string): void => {
      const successMessage =
        status === 'syncing'
          ? `Conexão estabelecida! ${importResult.data.imported} conta(s) importada(s) com sucesso!`
          : `${importResult.data.imported} conta(s) importada(s) com sucesso!`;

      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      onSuccessRef.current?.();
    },
    [companyId, queryClient],
  );

  const handleImportError = useCallback(
    (
      error: unknown,
      attempt: number,
      maxRetries: number,
      retryDelays: number[],
    ): Promise<boolean> => {
      console.error(`[OpenFinanceModal] Error importing accounts (attempt ${attempt + 1}):`, error);

      const status = (error as { response?: { status?: number } })?.response?.status;

      if (status === 403) {
        toast.warning('Limite de contas Open Finance atingido. Adquira mais slots para continuar.');
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccessRef.current?.();
        return Promise.resolve(true);
      }

      if (attempt === maxRetries - 1) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao importar contas';
        toast.error(`Erro ao importar contas: ${errorMessage}`);
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccessRef.current?.();
        return Promise.resolve(true);
      }

      const delay = retryDelays[attempt] ?? 10000;
      return new Promise((resolve) => setTimeout(() => resolve(false), delay));
    },
    [companyId, queryClient],
  );

  const handleNoAccountsFound = useCallback(
    (attempt: number, maxRetries: number, retryDelays: number[]): Promise<void> => {
      if (attempt < maxRetries - 1) {
        const delay = retryDelays[attempt] ?? 10000;
        console.log(`[OpenFinanceModal] No accounts found yet. Retrying in ${delay}ms...`);
        return new Promise((resolve) => setTimeout(resolve, delay));
      }

      console.warn('[OpenFinanceModal] No accounts found after all retries');
      toast.warning('Nenhuma conta encontrada para importar. Tente novamente mais tarde.');
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      onSuccessRef.current?.();
      return Promise.resolve();
    },
    [companyId, queryClient],
  );

  const importAccountsWithRetry = useCallback(
    async (itemId: string, status: string): Promise<void> => {
      const maxRetries = 3;
      const retryDelays = [6000, 10000, 15000];

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const availableAccounts = await getAccounts(companyId, itemId);

          if (availableAccounts && availableAccounts.length > 0) {
            const accountIds = availableAccounts.map((acc) => acc.id);
            const importResult = await importAccounts(companyId, itemId, accountIds);
            handleSuccessfulImport(importResult, status);
            return;
          }

          await handleNoAccountsFound(attempt, maxRetries, retryDelays);
        } catch (error) {
          const shouldStop = await handleImportError(error, attempt, maxRetries, retryDelays);
          if (shouldStop) return;
        }
      }
    },
    [companyId, handleSuccessfulImport, handleNoAccountsFound, handleImportError],
  );

  return {
    importAccountsWithRetry,
  };
};
