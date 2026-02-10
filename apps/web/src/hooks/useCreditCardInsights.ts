import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';
import {
  getCreditCardInsights,
  generateCreditCardInsights,
  type CreditCardInsight,
} from '@/services/agentService';

const INSIGHTS_STALE_TIME = 5 * 60 * 1000;

export function useCreditCardInsights(companyId: string, cardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['credit-card-insights', companyId, cardId] as const;

  const {
    data: insights,
    isLoading,
    error,
    isFetching,
  } = useQuery<CreditCardInsight>({
    queryKey,
    queryFn: () => getCreditCardInsights(companyId, cardId),
    enabled: !!companyId && !!cardId,
    staleTime: INSIGHTS_STALE_TIME,
    retry: 1,
  });

  const generateMutation = useMutation({
    mutationFn: () => generateCreditCardInsights(companyId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Análise atualizada',
        description: 'A análise do seu cartão foi atualizada com sucesso.',
        type: 'success',
      });
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      logApiError(apiError);

      const message =
        apiError.status === 429
          ? 'Limite de análises atingido por hoje. Tente novamente amanhã.'
          : getUserFriendlyMessage(apiError);

      toast({
        title: 'Erro na análise',
        description: message,
        type: 'error',
      });
    },
  });

  return {
    insights,
    isLoading,
    isFetching,
    error,
    generateInsights: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    generateError: generateMutation.error,
  };
}
