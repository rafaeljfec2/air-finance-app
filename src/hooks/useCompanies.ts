import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  type Company,
  type CreateCompany,
} from '../services/companyService';

export const useCompanies = () => {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: companies,
    isLoading,
    error,
  } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  const getCompany = (id: string) =>
    useQuery<Company>({
      queryKey: ['companies', id],
      queryFn: () => getCompanyById(id),
      enabled: !!id,
    });

  // Mutations
  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCompany> }) =>
      updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', id] });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.removeQueries({ queryKey: ['companies', id] });
    },
  });

  return {
    companies,
    isLoading,
    error,
    getCompany,
    createCompany: createCompanyMutation.mutate,
    updateCompany: updateCompanyMutation.mutate,
    deleteCompany: deleteCompanyMutation.mutate,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending,
    createError: createCompanyMutation.error,
    updateError: updateCompanyMutation.error,
    deleteError: deleteCompanyMutation.error,
  };
};
