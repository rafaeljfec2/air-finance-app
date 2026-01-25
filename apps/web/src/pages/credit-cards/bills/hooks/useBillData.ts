import { useQuery } from '@tanstack/react-query';
import { getCreditCardBill, type CreditCardBillResponse } from '@/services/creditCardService';

interface UseBillDataParams {
  companyId: string;
  cardId: string;
  month: string;
  currentPage: number;
  creditCardId?: string;
}

export const useBillData = ({
  companyId,
  cardId,
  month,
  currentPage,
  creditCardId,
}: UseBillDataParams) => {
  const {
    data: billData,
    isLoading: isLoadingBill,
    error: billError,
    isFetching,
  } = useQuery<CreditCardBillResponse>({
    queryKey: ['credit-card-bill', companyId, cardId, month, currentPage],
    queryFn: () => getCreditCardBill(companyId, cardId, month, { page: currentPage, limit: 10 }),
    enabled: !!companyId && !!cardId && !!month && !!creditCardId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: (previousData) => previousData,
  });

  return {
    billData,
    isLoadingBill,
    isFetching,
    billError,
  };
};
