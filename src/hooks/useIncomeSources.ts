import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    data: incomeSources,
    isLoading,
    error,
  } = useQuery<IncomeSource[]>({
    queryKey: ['income-sources'],
    queryFn: getIncomeSources,
  });

  const getIncomeSource = (id: string) => {
    return useQuery<IncomeSource>({
      queryKey: ['income-source', id],
      queryFn: () => getIncomeSourceById(id),
      enabled: !!id,
    });
  };

  const getProjection = (id: string) => {
    return useQuery({
      queryKey: ['income-source-projection', id],
      queryFn: () => getIncomeSourceProjection(id),
      enabled: !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: createIncomeSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateIncomeSource> }) =>
      updateIncomeSource(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
      queryClient.invalidateQueries({ queryKey: ['income-source', id] });
      queryClient.invalidateQueries({ queryKey: ['income-source-projection', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncomeSource,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
      queryClient.removeQueries({ queryKey: ['income-source', id] });
      queryClient.removeQueries({ queryKey: ['income-source-projection', id] });
    },
  });

  return {
    incomeSources,
    isLoading,
    error,
    getIncomeSource,
    getProjection,
    createIncomeSource: createMutation.mutate,
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
