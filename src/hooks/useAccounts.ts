import { useCompanyStore } from '@/stores/company';
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
import { toast } from '@/components/ui/toast';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';

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
        companyId && id ? getAccountById(companyId, id) : Promise.reject('No companyId or id'),
      enabled: !!companyId && !!id,
    });
  };

  const useGetBalance = (id: string) => {
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
      companyId && id ? updateAccount(companyId, id, data) : Promise.reject('No companyId or id'),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.invalidateQueries({ queryKey: ['account', companyId, id] });
      queryClient.invalidateQueries({ queryKey: ['account-balance', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Conta atualizada com sucesso!',
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
    mutationFn: (id: string) =>
      companyId && id ? deleteAccount(companyId, id) : Promise.reject('No companyId or id'),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.removeQueries({ queryKey: ['account', companyId, id] });
      queryClient.removeQueries({ queryKey: ['account-balance', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Conta excluída com sucesso!',
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
    accounts,
    isLoading,
    error,
    getAccount: useGetAccount,
    getBalance: useGetBalance,
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
