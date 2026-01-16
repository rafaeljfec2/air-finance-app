import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDigitalAccounts,
  createDigitalAccount,
  updateDigitalAccount,
  deleteDigitalAccount,
  DigitalAccount,
  CreateDigitalAccount,
} from '../services/digitalAccountService';

export const useDigitalAccounts = () => {
  const queryClient = useQueryClient();

  const {
    data: digitalAccounts,
    isLoading,
    error,
  } = useQuery<DigitalAccount[]>({
    queryKey: ['digital-accounts'],
    queryFn: getDigitalAccounts,
  });

  const createMutation = useMutation({
    mutationFn: createDigitalAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDigitalAccount> }) =>
      updateDigitalAccount(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['digital-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['digital-account', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDigitalAccount,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['digital-accounts'] });
      queryClient.removeQueries({ queryKey: ['digital-account', id] });
    },
  });

  return {
    digitalAccounts,
    isLoading,
    error,
    createDigitalAccount: createMutation.mutate,
    updateDigitalAccount: updateMutation.mutate,
    deleteDigitalAccount: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
