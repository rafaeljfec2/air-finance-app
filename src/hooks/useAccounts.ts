import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountBalance,
  type Account,
  type CreateAccount,
} from '../services/accountService';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  const getAccount = (id: string) => {
    return useQuery<Account>({
      queryKey: ['account', id],
      queryFn: () => getAccountById(id),
      enabled: !!id,
    });
  };

  const getBalance = (id: string) => {
    return useQuery<number>({
      queryKey: ['account-balance', id],
      queryFn: () => getAccountBalance(id),
      enabled: !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAccount> }) =>
      updateAccount(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', id] });
      queryClient.invalidateQueries({ queryKey: ['account-balance', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.removeQueries({ queryKey: ['account', id] });
      queryClient.removeQueries({ queryKey: ['account-balance', id] });
    },
  });

  return {
    accounts,
    isLoading,
    error,
    getAccount,
    getBalance,
    createAccount: createMutation.mutate,
    updateAccount: updateMutation.mutate,
    deleteAccount: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
