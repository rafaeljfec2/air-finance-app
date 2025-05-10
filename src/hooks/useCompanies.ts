import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/companyService';
import { Company } from '@/types/company';
import { toast } from '@/components/ui/toast';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';

export function useCompanies() {
  const queryClient = useQueryClient();

  const {
    data: companies,
    isLoading,
    error,
  } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: companyService.getAll,
  });

  const { mutate: createCompany, isPending: isCreating } = useMutation({
    mutationFn: companyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Sucesso',
        description: 'Empresa cadastrada com sucesso!',
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

  const { mutate: updateCompany, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Sucesso',
        description: 'Empresa atualizada com sucesso!',
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

  const { mutate: deleteCompany, isPending: isDeleting } = useMutation({
    mutationFn: companyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Sucesso',
        description: 'Empresa excluída com sucesso!',
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
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
