import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDependents,
  createDependent,
  updateDependent,
  deleteDependent,
  type Dependent,
  type CreateDependent,
} from '../services/dependentService';

export const useDependents = () => {
  const queryClient = useQueryClient();

  const {
    data: dependents,
    isLoading,
    error,
  } = useQuery<Dependent[]>({
    queryKey: ['dependents'],
    queryFn: getDependents,
  });

  const createMutation = useMutation({
    mutationFn: createDependent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dependents'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDependent> }) =>
      updateDependent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dependents'] });
      queryClient.invalidateQueries({ queryKey: ['dependent', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDependent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dependents'] });
      queryClient.removeQueries({ queryKey: ['dependent', id] });
    },
  });

  return {
    dependents,
    isLoading,
    error,
    createDependent: createMutation.mutate,
    updateDependent: updateMutation.mutate,
    deleteDependent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
