import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createTransaction,
    CreateTransactionPayload,
    deleteTransaction,
    getPreviousBalance,
    getTransactions,
    Transaction,
    updateTransaction,
    type TransactionFilters,
} from '../services/transactionService';

export const useTransactions = (companyId: string, filters?: TransactionFilters) => {
  const queryClient = useQueryClient();

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Transaction[]>({
    queryKey: [
      'transactions',
      companyId,
      filters?.startDate ?? null,
      filters?.endDate ?? null,
      filters?.accountId ?? null,
    ],
    queryFn: () => getTransactions(companyId, filters),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTransactionPayload) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionPayload> }) =>
      updateTransaction(companyId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransaction(companyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });
    },
  });

  return {
    transactions,
    isLoading,
    isFetching,
    error,
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
};

export const usePreviousBalance = (
  companyId: string,
  startDate?: string,
  accountId?: string,
  source: 'transactions' | 'extracts' = 'transactions',
) => {
  const {
    data: previousBalance,
    isLoading,
    error,
  } = useQuery<number>({
    queryKey: ['previousBalance', companyId, startDate ?? null, accountId ?? null, source],
    queryFn: () => {
      if (!startDate) {
        return Promise.resolve(0);
      }
      return getPreviousBalance(companyId, startDate, accountId, source);
    },
    enabled: !!companyId && !!startDate,
  });

  return {
    previousBalance: previousBalance ?? 0,
    isLoading,
    error,
  };
};
