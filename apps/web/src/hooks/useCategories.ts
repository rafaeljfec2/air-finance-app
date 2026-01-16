import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CreateCategory,
} from '../services/categoryService';
import { toast } from '@/components/ui/toast';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';

export const useCategories = (companyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ['categories', companyId],
    queryFn: () => getCategories(companyId),
    enabled: !!companyId,
  });

  const useGetCategory = (id: string) => {
    return useQuery<Category>({
      queryKey: ['category', companyId, id],
      queryFn: () => getCategoryById(companyId, id),
      enabled: !!id && !!companyId,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateCategory) => createCategory(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
      toast({
        title: 'Sucesso',
        description: 'Categoria cadastrada com sucesso!',
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
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategory> }) =>
      updateCategory(companyId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
      queryClient.invalidateQueries({ queryKey: ['category', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Categoria atualizada com sucesso!',
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
    mutationFn: (id: string) => deleteCategory(companyId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
      queryClient.removeQueries({ queryKey: ['category', companyId, id] });
      toast({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso!',
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
    categories,
    isLoading,
    error,
    getCategory: useGetCategory,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
