import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  Investment,
  CreateInvestment,
} from '../services/investmentService';

export const useInvestments = () => {
  const queryClient = useQueryClient();

  const {
    data: investments,
    isLoading,
    error,
  } = useQuery<Investment[]>({
    queryKey: ['investments'],
    queryFn: getInvestments,
  });

  const createMutation = useMutation({
    mutationFn: createInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateInvestment> }) =>
      updateInvestment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['investment', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInvestment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.removeQueries({ queryKey: ['investment', id] });
    },
  });

  return {
    investments,
    isLoading,
    error,
    createInvestment: createMutation.mutate,
    updateInvestment: updateMutation.mutate,
    deleteInvestment: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
