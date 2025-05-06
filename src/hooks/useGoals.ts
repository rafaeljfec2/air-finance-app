import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalProgress,
  type Goal,
  type CreateGoal,
} from '../services/goalService';

export const useGoals = (companyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: goals,
    isLoading,
    error,
  } = useQuery<Goal[]>({
    queryKey: ['goals', companyId],
    queryFn: () => getGoals(companyId),
  });

  const getGoal = (id: string) => {
    return useQuery<Goal>({
      queryKey: ['goal', companyId, id],
      queryFn: () => getGoalById(companyId, id),
      enabled: !!id,
    });
  };

  const getProgress = (id: string) => {
    return useQuery({
      queryKey: ['goal-progress', companyId, id],
      queryFn: () => getGoalProgress(id),
      enabled: !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateGoal) => createGoal(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoal> }) =>
      updateGoal(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', id] });
      queryClient.invalidateQueries({ queryKey: ['goal-progress', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGoal(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.removeQueries({ queryKey: ['goal', id] });
      queryClient.removeQueries({ queryKey: ['goal-progress', id] });
    },
  });

  return {
    goals,
    isLoading,
    error,
    getGoal,
    getProgress,
    createGoal: createMutation.mutate,
    updateGoal: updateMutation.mutate,
    deleteGoal: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
