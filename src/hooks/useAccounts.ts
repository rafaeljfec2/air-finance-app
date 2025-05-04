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
import { useCompanyStore } from '@/store/company';

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

  const getAccount = (id: string) => {
    return useQuery<Account>({
      queryKey: ['account', companyId, id],
      queryFn: () =>
        companyId && id ? getAccountById(companyId, id) : Promise.reject('No companyId or id'),
      enabled: !!companyId && !!id,
    });
  };

  const getBalance = (id: string) => {
    return useQuery<number>({
      queryKey: ['account-balance', companyId, id],
      queryFn: () =>
        companyId && id ? getAccountBalance(id) : Promise.reject('No companyId or id'),
      enabled: !!companyId && !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAccount) =>
      companyId ? createAccount(companyId, data) : Promise.reject('No companyId'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAccount> }) =>
      companyId && id ? updateAccount(companyId, id, data) : Promise.reject('No companyId or id'),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.invalidateQueries({ queryKey: ['account', companyId, id] });
      queryClient.invalidateQueries({ queryKey: ['account-balance', companyId, id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      companyId && id ? deleteAccount(companyId, id) : Promise.reject('No companyId or id'),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.removeQueries({ queryKey: ['account', companyId, id] });
      queryClient.removeQueries({ queryKey: ['account-balance', companyId, id] });
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
