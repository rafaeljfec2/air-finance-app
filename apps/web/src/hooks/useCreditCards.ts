import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCreditCards,
  getCreditCardById,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCreditCardStatement,
  updateCreditCardStatus,
  type CreditCard,
  CreateCreditCardPayload,
} from '../services/creditCardService';
import { toast } from '@/components/ui/toast';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';

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

  function useGetCreditCard(id: string) {
    return useQuery<CreditCard>({
      queryKey: ['credit-card', companyId, id],
      queryFn: () => getCreditCardById(companyId, id),
      enabled: !!id && !!companyId,
    });
  }

  function useGetStatement(id: string, month: number, year: number) {
    return useQuery({
      queryKey: ['credit-card-statement', companyId, id, month, year],
      queryFn: () => getCreditCardStatement(id, month, year),
      enabled: !!id && !!companyId,
    });
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateCreditCardPayload) => createCreditCard(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      toast({
        title: 'Sucesso',
        description: 'Cartão cadastrado com sucesso!',
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
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCreditCardPayload> }) =>
      updateCreditCard(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      queryClient.invalidateQueries({ queryKey: ['credit-card', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Cartão atualizado com sucesso!',
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
    mutationFn: (id: string) => deleteCreditCard(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      queryClient.removeQueries({ queryKey: ['credit-card', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Cartão excluído com sucesso!',
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

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCreditCardStatus(companyId, id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards', companyId] });
      queryClient.invalidateQueries({ queryKey: ['credit-card', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Status do cartão atualizado com sucesso!',
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
    creditCards,
    isLoading,
    error,
    useGetCreditCard,
    useGetStatement,
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
