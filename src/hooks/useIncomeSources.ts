import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  getIncomeSources,
  getIncomeSourceById,
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
  getIncomeSourceProjection,
  type IncomeSource,
  type CreateIncomeSource,
} from '../services/incomeSourceService';

export const useIncomeSources = () => {
  const queryClient = useQueryClient();

  const {
    data: incomeSources = [],
    isLoading: loading,
    error,
  } = useQuery<IncomeSource[], ReactNode>({
    queryKey: ['income-sources'],
    queryFn: getIncomeSources,
  });

  const getIncomeSource = (id: string) => {
    return useQuery<IncomeSource, ReactNode>({
      queryKey: ['income-source', id],
      queryFn: () => getIncomeSourceById(id),
      enabled: !!id,
    });
  };

  const getProjection = (id: string) => {
    return useQuery<any, ReactNode>({
      queryKey: ['income-source-projection', id],
      queryFn: () => getIncomeSourceProjection(id),
      enabled: !!id,
    });
  };

  const createMutation = useMutation<IncomeSource, ReactNode, CreateIncomeSource>({
    mutationFn: createIncomeSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
    },
  });

  const updateMutation = useMutation<
    IncomeSource,
    ReactNode,
    { id: string; data: CreateIncomeSource }
  >({
    mutationFn: ({ id, data }) => updateIncomeSource(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
      queryClient.invalidateQueries({ queryKey: ['income-source', id] });
      queryClient.invalidateQueries({ queryKey: ['income-source-projection', id] });
    },
  });

  const deleteMutation = useMutation<void, ReactNode, string>({
    mutationFn: deleteIncomeSource,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
      queryClient.removeQueries({ queryKey: ['income-source', id] });
      queryClient.removeQueries({ queryKey: ['income-source-projection', id] });
    },
  });

  return {
    incomeSources,
    loading,
    error,
    getIncomeSource,
    getProjection,
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
