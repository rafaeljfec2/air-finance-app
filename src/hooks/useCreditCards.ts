import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCreditCards,
  getCreditCardById,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCreditCardStatement,
  type CreditCard,
  type CreateCreditCard,
} from '../services/creditCardService';

export const useCreditCards = (companyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: creditCards,
    isLoading,
    error,
  } = useQuery<CreditCard[]>({
    queryKey: ['credit-cards', companyId],
    queryFn: () => getCreditCards(companyId),
    enabled: !!companyId,
  });

  const getCreditCard = (id: string) => {
    return useQuery<CreditCard>({
      queryKey: ['credit-card', companyId, id],
      queryFn: () => getCreditCardById(companyId, id),
      enabled: !!id && !!companyId,
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
    mutationFn: (data: CreateCreditCard) => createCreditCard(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCreditCard> }) =>
      updateCreditCard(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      queryClient.invalidateQueries({ queryKey: ['credit-card', companyId, id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCreditCard(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      queryClient.removeQueries({ queryKey: ['credit-card', companyId, id] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCreditCardStatus(companyId, id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      queryClient.invalidateQueries({ queryKey: ['credit-card', companyId, id] });
    },
  });

  return {
    creditCards,
    isLoading,
    error,
    getCreditCard,
    getStatement,
    createCreditCard: createMutation.mutateAsync,
    updateCreditCard: updateMutation.mutateAsync,
    deleteCreditCard: deleteMutation.mutateAsync,
    updateCreditCardStatus: updateStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
