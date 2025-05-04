import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanAmortization,
  type Loan,
  type CreateLoan,
} from '../services/loanService';

export const useLoans = () => {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: loans,
    isLoading,
    error,
  } = useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: getLoans,
  });

  const getLoan = (id: string) =>
    useQuery<Loan>({
      queryKey: ['loans', id],
      queryFn: () => getLoanById(id),
      enabled: !!id,
    });

  const getAmortization = (id: string) =>
    useQuery({
      queryKey: ['loans', id, 'amortization'],
      queryFn: () => getLoanAmortization(id),
      enabled: !!id,
    });

  // Mutations
  const createLoanMutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  const updateLoanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateLoan> }) => updateLoan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loans', id] });
      queryClient.invalidateQueries({ queryKey: ['loans', id, 'amortization'] });
    },
  });

  const deleteLoanMutation = useMutation({
    mutationFn: deleteLoan,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loans', id] });
      queryClient.invalidateQueries({ queryKey: ['loans', id, 'amortization'] });
    },
  });

  return {
    loans,
    isLoading,
    error,
    getLoan,
    getAmortization,
    createLoan: createLoanMutation.mutate,
    updateLoan: updateLoanMutation.mutate,
    deleteLoan: deleteLoanMutation.mutate,
    isCreating: createLoanMutation.isPending,
    isUpdating: updateLoanMutation.isPending,
    isDeleting: deleteLoanMutation.isPending,
    createError: createLoanMutation.error,
    updateError: updateLoanMutation.error,
    deleteError: deleteLoanMutation.error,
  };
};
