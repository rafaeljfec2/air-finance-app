import { toast } from '@/components/ui/toast';
import { getUserFriendlyMessage, logApiError, parseApiError } from '@/utils/apiErrorHandler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactionById,
  getRecurringTransactions,
  updateRecurringTransaction,
  type CreateRecurringTransaction,
  type RecurringTransaction,
  type UpdateRecurringTransaction,
} from '../services/recurringTransactionService';

export const useRecurringTransactions = (companyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: recurringTransactions,
    isLoading,
    error,
  } = useQuery<RecurringTransaction[]>({
    queryKey: ['recurring-transactions', companyId],
    queryFn: () => getRecurringTransactions(companyId),
    enabled: !!companyId,
  });

  function useGetRecurringTransaction(id: string) {
    return useQuery<RecurringTransaction>({
      queryKey: ['recurring-transaction', companyId, id],
      queryFn: () => getRecurringTransactionById(companyId, id),
      enabled: !!id && !!companyId,
    });
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateRecurringTransaction) => createRecurringTransaction(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions', companyId] });
      toast({
        title: 'Sucesso',
        description: 'Transação recorrente cadastrada com sucesso!',
        type: 'success',
      });
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      logApiError(apiError);
      toast({
        title: 'Erro',
        description: getUserFriendlyMessage(apiError),
        type: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringTransaction }) =>
      updateRecurringTransaction(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions', companyId] });
      queryClient.invalidateQueries({ queryKey: ['recurring-transaction', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Transação recorrente atualizada com sucesso!',
        type: 'success',
      });
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      logApiError(apiError);
      toast({
        title: 'Erro',
        description: getUserFriendlyMessage(apiError),
        type: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecurringTransaction(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions', companyId] });
      queryClient.removeQueries({ queryKey: ['recurring-transaction', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Transação recorrente removida com sucesso!',
        type: 'success',
      });
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      logApiError(apiError);
      toast({
        title: 'Erro',
        description: getUserFriendlyMessage(apiError),
        type: 'error',
      });
    },
  });

  return {
    recurringTransactions,
    isLoading,
    error,
    getRecurringTransaction: useGetRecurringTransaction,
    createRecurringTransaction: createMutation.mutate,
    updateRecurringTransaction: updateMutation.mutate,
    deleteRecurringTransaction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
