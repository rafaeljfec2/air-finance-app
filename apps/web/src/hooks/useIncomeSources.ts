import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  getIncomeSources,
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
  type IncomeSource,
  type CreateIncomeSource,
} from '../services/incomeSourceService';

export const useIncomeSources = (companyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: incomeSources = [],
    isLoading: loading,
    error,
  } = useQuery<IncomeSource[], ReactNode>({
    queryKey: ['income-sources', companyId],
    queryFn: () => getIncomeSources(companyId),
  });

  const createMutation = useMutation<IncomeSource, ReactNode, CreateIncomeSource>({
    mutationFn: (data) => createIncomeSource(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources', companyId] });
    },
  });

  const updateMutation = useMutation<
    IncomeSource,
    ReactNode,
    { id: string; data: CreateIncomeSource }
  >({
    mutationFn: ({ id, data }) => updateIncomeSource(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['income-sources', companyId] });
      queryClient.invalidateQueries({ queryKey: ['income-source', companyId, id] });
      queryClient.invalidateQueries({ queryKey: ['income-source-projection', companyId, id] });
    },
  });

  const deleteMutation = useMutation<void, ReactNode, string>({
    mutationFn: (id) => deleteIncomeSource(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['income-sources', companyId] });
      queryClient.removeQueries({ queryKey: ['income-source', companyId, id] });
      queryClient.removeQueries({ queryKey: ['income-source-projection', companyId, id] });
    },
  });

  return {
    incomeSources,
    loading,
    error,
    addIncomeSource: createMutation.mutate,
    updateIncomeSource: updateMutation.mutate,
    deleteIncomeSource: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
