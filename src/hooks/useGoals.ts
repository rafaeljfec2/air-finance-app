import { toast } from '@/components/ui/toast';
import { getUserFriendlyMessage, logApiError, parseApiError } from '@/utils/apiErrorHandler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGoal,
  deleteGoal,
  getGoalById,
  getGoalProgress,
  getGoals,
  updateGoal,
  type CreateGoal,
  type Goal,
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
    enabled: !!companyId,
  });

  function useGetGoal(id: string) {
    return useQuery<Goal>({
      queryKey: ['goal', companyId, id],
      queryFn: () => getGoalById(companyId, id),
      enabled: !!id && !!companyId,
    });
  }

  function useGetProgress(id: string) {
    return useQuery({
      queryKey: ['goal-progress', companyId, id],
      queryFn: () => (companyId ? getGoalProgress(companyId, id) : Promise.reject('No companyId')),
      enabled: !!id && !!companyId,
    });
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateGoal) => createGoal(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', companyId] });
      toast({
        title: 'Sucesso',
        description: 'Meta cadastrada com sucesso!',
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
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoal> }) =>
      updateGoal(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['goals', companyId] });
      queryClient.invalidateQueries({ queryKey: ['goal', companyId, id] });
      queryClient.invalidateQueries({ queryKey: ['goal-progress', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Meta atualizada com sucesso!',
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
    mutationFn: (id: string) => deleteGoal(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['goals', companyId] });
      queryClient.removeQueries({ queryKey: ['goal', companyId, id] });
      queryClient.removeQueries({ queryKey: ['goal-progress', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Meta removida com sucesso!',
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
    goals,
    isLoading,
    error,
    getGoal: useGetGoal,
    getProgress: useGetProgress,
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
