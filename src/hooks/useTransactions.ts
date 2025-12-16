import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  Transaction,
  CreateTransactionPayload,
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
    queryKey: ['transactions', companyId, filters?.startDate ?? null, filters?.endDate ?? null],
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
    deleteTransaction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
};
