import { useCompanyStore } from '@/stores/company';
import { useCreditCardQueries } from './useCreditCardQueries';
import { useBillData } from './useBillData';
import { useBillTransactions } from './useBillTransactions';
import { useBillPagination } from './useBillPagination';
import { useCurrentBill } from './utils/billConstruction';
import { useInitialLoad } from './useInitialLoad';
import type { UseCreditCardBillsReturn } from './types';

export function useCreditCardBills(cardId: string, month: string): UseCreditCardBillsReturn {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const { creditCard, account, isLoadingCard, isLoadingAccounts, cardError, accountsError } =
    useCreditCardQueries({
      companyId,
      cardId,
    });

  const { currentPage } = useBillPagination({
    cardId,
    month,
    billData: undefined,
    isFetching: false,
  });

  const { billData, isLoadingBill, isFetching, billError } = useBillData({
    companyId,
    cardId,
    month,
    currentPage,
    creditCardId: creditCard?.id,
  });

  const {
    currentPage: finalCurrentPage,
    isLoadingMore: finalIsLoadingMore,
    pagination: finalPagination,
    loadMore: finalLoadMore,
    hasMore: finalHasMore,
  } = useBillPagination({
    cardId,
    month,
    billData,
    isFetching,
  });

  const { isInitialLoad } = useInitialLoad({ billData, cardId, month });

  const { allTransactions } = useBillTransactions({
    billData,
    currentPage: finalCurrentPage,
    cardId,
    month,
  });

  const currentBill = useCurrentBill({
    billData,
    creditCard,
    month,
    account,
    allTransactions,
  });

  const isLoading = isLoadingCard || isLoadingAccounts || (isLoadingBill && finalCurrentPage === 1);
  const error = cardError ?? accountsError ?? billError;

  return {
    creditCard,
    account,
    currentBill,
    isLoading,
    isLoadingMore: finalIsLoadingMore,
    isInitialLoad,
    error: error ?? null,
    pagination: finalPagination,
    loadMore: finalLoadMore,
    hasMore: finalHasMore,
  };
}
