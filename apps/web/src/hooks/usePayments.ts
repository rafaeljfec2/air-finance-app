import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPixPayment,
  createTedPayment,
  createBoletoPayment,
  createDarfPayment,
  createPixCharge,
  getPaymentById,
  listPayments,
  cancelPayment,
  listPixCharges,
  cancelPixCharge,
  type PixPaymentRequest,
  type TedPaymentRequest,
  type BoletoPaymentRequest,
  type DarfPaymentRequest,
  type PixChargeRequest,
  type Payment,
  type PixCharge,
  type PaymentFilters,
} from '@/services/paymentService';

const PAYMENTS_KEY = 'payments';
const PIX_CHARGES_KEY = 'pix-charges';

export function usePayments(accountId: string, filters?: PaymentFilters) {
  const queryClient = useQueryClient();

  const {
    data: payments,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Payment[]>({
    queryKey: [PAYMENTS_KEY, accountId, filters],
    queryFn: () => listPayments(accountId, filters),
    enabled: !!accountId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, accountId] });
  };

  return { payments, isLoading, isFetching, error, refetch, invalidate };
}

export function usePaymentById(accountId: string, paymentId: string) {
  return useQuery<Payment>({
    queryKey: [PAYMENTS_KEY, accountId, paymentId],
    queryFn: () => getPaymentById(accountId, paymentId),
    enabled: !!accountId && !!paymentId,
  });
}

export function useCreatePixPayment(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PixPaymentRequest) => createPixPayment(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, accountId] });
    },
  });
}

export function useCreateTedPayment(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TedPaymentRequest) => createTedPayment(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, accountId] });
    },
  });
}

export function useCreateBoletoPayment(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BoletoPaymentRequest) => createBoletoPayment(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, accountId] });
    },
  });
}

export function useCreateDarfPayment(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DarfPaymentRequest) => createDarfPayment(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, accountId] });
    },
  });
}

export function useCancelPayment(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => cancelPayment(accountId, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, accountId] });
    },
  });
}

export function usePixCharges(accountId: string) {
  return useQuery<PixCharge[]>({
    queryKey: [PIX_CHARGES_KEY, accountId],
    queryFn: () => listPixCharges(accountId),
    enabled: !!accountId,
  });
}

export function useCreatePixCharge(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PixChargeRequest) => createPixCharge(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIX_CHARGES_KEY, accountId] });
    },
  });
}

export function useCancelPixCharge(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (txid: string) => cancelPixCharge(accountId, txid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIX_CHARGES_KEY, accountId] });
    },
  });
}
