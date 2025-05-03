import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCreditCards,
  getCreditCardById,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCreditCardStatement,
  CreditCard,
  CreateCreditCard,
} from '../services/creditCardService';

export const useCreditCards = () => {
  const queryClient = useQueryClient();

  const {
    data: creditCards,
    isLoading,
    error,
  } = useQuery<CreditCard[]>({
    queryKey: ['credit-cards'],
    queryFn: getCreditCards,
  });

  const getCreditCard = (id: string) => {
    return useQuery<CreditCard>({
      queryKey: ['credit-card', id],
      queryFn: () => getCreditCardById(id),
      enabled: !!id,
    });
  };

  const getStatement = (id: string, month: number, year: number) => {
    return useQuery({
      queryKey: ['credit-card-statement', id, month, year],
      queryFn: () => getCreditCardStatement(id, month, year),
      enabled: !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: createCreditCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCreditCard> }) =>
      updateCreditCard(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      queryClient.invalidateQueries({ queryKey: ['credit-card', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCreditCard,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      queryClient.removeQueries({ queryKey: ['credit-card', id] });
    },
  });

  return {
    creditCards,
    isLoading,
    error,
    getCreditCard,
    getStatement,
    createCreditCard: createMutation.mutate,
    updateCreditCard: updateMutation.mutate,
    deleteCreditCard: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
