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

export const useGoals = () => {
  const queryClient = useQueryClient();

  const {
    data: goals,
    isLoading,
    error,
  } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const getGoal = (id: string) => {
    return useQuery<Goal>({
      queryKey: ['goal', id],
      queryFn: () => getGoalById(id),
      enabled: !!id,
    });
  };

  const getProgress = (id: string) => {
    return useQuery({
      queryKey: ['goal-progress', id],
      queryFn: () => getGoalProgress(id),
      enabled: !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoal> }) => updateGoal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', id] });
      queryClient.invalidateQueries({ queryKey: ['goal-progress', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
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
