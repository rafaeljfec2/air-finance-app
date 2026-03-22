import { useMutation } from '@tanstack/react-query';

import { toast } from '@/components/ui/toast';
import {
  createInstallments,
  importOfx,
  type InstallmentTransaction,
} from '@/services/transactionService';

interface UseImportOfxMutationsParams {
  readonly companyId: string;
  readonly refetch: () => void;
  readonly onImportSuccess: (hasInstallments: boolean) => void;
  readonly onImportError: () => void;
}

export function useImportOfxMutations({
  companyId,
  refetch,
  onImportSuccess,
  onImportError,
}: UseImportOfxMutationsParams) {
  const importMutation = useMutation({
    mutationFn: async ({
      file,
      accountId,
      importToCashFlow,
      clearCashFlow,
    }: {
      file: File;
      accountId: string;
      importToCashFlow?: boolean;
      clearCashFlow?: boolean;
    }) => {
      if (!companyId) throw new Error('Selecione uma empresa');
      return importOfx(companyId, file, accountId, importToCashFlow, clearCashFlow);
    },
    onSuccess: (data) => {
      toast({
        title: 'Importação concluída',
        description: 'Extrato salvo com sucesso.',
        type: 'success',
      });
      refetch();

      const hasInstallments =
        !!data.installmentTransactions && data.installmentTransactions.length > 0;
      onImportSuccess(hasInstallments);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro na importação',
        description: error.message || 'Não foi possível importar o arquivo OFX. Tente novamente.',
        type: 'error',
      });
      onImportError();
    },
  });

  const createInstallmentsMutation = useMutation({
    mutationFn: async ({
      installments,
      accountId,
      periodEnd,
    }: {
      installments: InstallmentTransaction[];
      accountId: string | null | undefined;
      periodEnd?: string;
    }) => {
      if (!companyId || !accountId) {
        throw new Error('Dados insuficientes para criar parcelas');
      }

      const promises = installments.map((tx) =>
        createInstallments(companyId, accountId ?? '', {
          description: tx.description,
          amount: tx.amount,
          date: tx.date,
          currentInstallment: tx.installmentInfo.current,
          totalInstallments: tx.installmentInfo.total,
          baseDescription: tx.installmentInfo.baseDescription,
          fitId: tx.fitId ?? undefined,
          periodEnd: tx.periodEnd ?? periodEnd,
        }),
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: 'Parcelas criadas',
        description: 'As parcelas futuras foram criadas com sucesso.',
        type: 'success',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar parcelas',
        description: error.message || 'Não foi possível criar as parcelas futuras.',
        type: 'error',
      });
    },
  });

  const handleImport = async (
    file: File,
    accountId: string,
    importToCashFlow?: boolean,
    clearCashFlow?: boolean,
  ) => {
    if (!file.name.toLowerCase().endsWith('.ofx')) {
      throw new Error('Selecione um arquivo com extensão .ofx');
    }
    return await importMutation.mutateAsync({ file, accountId, importToCashFlow, clearCashFlow });
  };

  const handleCreateInstallments = async (
    installments: InstallmentTransaction[],
    accountId: string,
    periodEnd?: string,
  ) => {
    await createInstallmentsMutation.mutateAsync({ installments, accountId, periodEnd });
  };

  return {
    handleImport,
    handleCreateInstallments,
    isImporting: importMutation.isPending,
  };
}
