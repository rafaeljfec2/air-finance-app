import { toast } from '@/components/ui/toast';
import { useCompanyStore } from '@/stores/company';
import { getUserFriendlyMessage, logApiError, parseApiError } from '@/utils/apiErrorHandler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAccount,
  deleteAccount,
  getAccountBalance,
  getAccountById,
  getAccounts,
  updateAccount,
  type Account,
  type CreateAccount,
} from '../services/accountService';

export const useAccounts = () => {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id;
  const queryClient = useQueryClient();

  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery<Account[]>({
    queryKey: ['accounts', companyId],
    queryFn: () => (companyId ? getAccounts(companyId) : Promise.resolve([])),
    enabled: !!companyId,
  });

  const useGetAccount = (id: string) => {
    return useQuery<Account>({
      queryKey: ['account', companyId, id],
      queryFn: () =>
        companyId && id
          ? getAccountById(companyId, id)
          : Promise.reject(new Error('No companyId or id')),
      enabled: !!companyId && !!id,
    });
  };

  const useGetBalance = (id: string) => {
    return useQuery<number>({
      queryKey: ['account-balance', companyId, id],
      queryFn: () =>
        companyId && id ? getAccountBalance(id) : Promise.reject(new Error('No companyId or id')),
      enabled: !!companyId && !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAccount) =>
      companyId ? createAccount(companyId, data) : Promise.reject(new Error('No companyId')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      toast({
        title: 'Sucesso',
        description: 'Conta cadastrada com sucesso!',
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
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAccount> }) =>
      companyId && id
        ? updateAccount(companyId, id, data)
        : Promise.reject(new Error('No companyId or id')),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['accounts', companyId] });
      await queryClient.cancelQueries({ queryKey: ['account', companyId, id] });

      const previousAccounts = queryClient.getQueryData<Account[]>(['accounts', companyId]);
      const previousAccount = queryClient.getQueryData<Account>(['account', companyId, id]);

      if (previousAccounts) {
        queryClient.setQueryData<Account[]>(['accounts', companyId], (prev) =>
          (prev ?? []).map((acc) =>
            acc.id === id
              ? ({ ...acc, ...data, updatedAt: new Date().toISOString() } as Account)
              : acc,
          ),
        );
      }

      if (previousAccount) {
        queryClient.setQueryData<Account>(['account', companyId, id], {
          ...previousAccount,
          ...data,
          updatedAt: new Date().toISOString(),
        } as Account);
      }

      return { previousAccounts, previousAccount };
    },
    onSuccess: (updatedAccount, { id }) => {
      if (updatedAccount) {
        queryClient.setQueryData<Account[]>(['accounts', companyId], (prev) =>
          (prev ?? []).map((acc) => (acc.id === id ? updatedAccount : acc)),
        );
        queryClient.setQueryData<Account>(['account', companyId, id], updatedAccount);
      }
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.invalidateQueries({ queryKey: ['account', companyId, id] });
      queryClient.invalidateQueries({ queryKey: ['account-balance', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Conta atualizada com sucesso!',
        type: 'success',
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts', companyId], context.previousAccounts);
      }
      if (context?.previousAccount && variables?.id) {
        queryClient.setQueryData(['account', companyId, variables.id], context.previousAccount);
      }
      const apiError = parseApiError(error);
      logApiError(apiError);
      toast({
        title: 'Erro',
        description: getUserFriendlyMessage(apiError),
        type: 'error',
      });
    },
    onSettled: (_data, _error, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        queryClient.invalidateQueries({ queryKey: ['account', companyId, variables.id] });
        queryClient.invalidateQueries({ queryKey: ['account-balance', companyId, variables.id] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      companyId && id
        ? deleteAccount(companyId, id)
        : Promise.reject(new Error('No companyId or id')),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['accounts', companyId] });
      await queryClient.cancelQueries({ queryKey: ['account', companyId, id] });
      await queryClient.cancelQueries({ queryKey: ['account-balance', companyId, id] });

      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData<Account[]>(['accounts', companyId]);
      const previousAccount = queryClient.getQueryData<Account>(['account', companyId, id]);

      // Optimistically update to the new value by removing the account from the list
      if (previousAccounts) {
        queryClient.setQueryData<Account[]>(['accounts', companyId], (prev) =>
          (prev ?? []).filter((acc) => acc.id !== id),
        );
      }

      // Remove individual account query
      queryClient.removeQueries({ queryKey: ['account', companyId, id] });
      queryClient.removeQueries({ queryKey: ['account-balance', companyId, id] });

      // Return a context object with the snapshotted value
      return { previousAccounts, previousAccount };
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.removeQueries({ queryKey: ['account', companyId, id] });
      queryClient.removeQueries({ queryKey: ['account-balance', companyId, id] });
      // Also invalidate any queries that might reference accounts (transactions, etc.)
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      toast({
        title: 'Sucesso',
        description: 'Conta excluída com sucesso!',
        type: 'success',
      });
    },
    onError: (error, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts', companyId], context.previousAccounts);
      }
      if (context?.previousAccount) {
        queryClient.setQueryData(['account', companyId, id], context.previousAccount);
      }
      const apiError = parseApiError(error);
      logApiError(apiError);
      toast({
        title: 'Erro',
        description: getUserFriendlyMessage(apiError),
        type: 'error',
      });
    },
    onSettled: (_, _error, id) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.removeQueries({ queryKey: ['account', companyId, id] });
      queryClient.removeQueries({ queryKey: ['account-balance', companyId, id] });
    },
  });

  return {
    accounts,
    isLoading,
    error,
    getAccount: useGetAccount,
    getBalance: useGetBalance,
    createAccount: createMutation.mutate,
    updateAccount: updateMutation.mutate,
    deleteAccount: deleteMutation.mutate,
    updateAccountAsync: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
