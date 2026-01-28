import { useMemo } from 'react';
import { useCompanyStore } from '@/stores/company';
import { useCategories } from '@/hooks/useCategories';
import { useCreditCardQueries } from './useCreditCardQueries';
import { useBillTransactions } from './useBillTransactions';
import { useBillPagination } from './useBillPagination';
import { useCurrentBill } from './utils/billConstruction';
import { useInitialLoad } from './useInitialLoad';
import type { UseCreditCardBillsReturn } from './types';

export function useCreditCardBills(cardId: string, month: string): UseCreditCardBillsReturn {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const { categories } = useCategories(companyId);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categories]);

  const { creditCard, account, isLoadingCard, isLoadingAccounts, cardError, accountsError } =
    useCreditCardQueries({
      companyId,
      cardId,
    });

  const {
    currentPage,
    isLoadingMore: finalIsLoadingMore,
    pagination: finalPagination,
    loadMore: finalLoadMore,
    hasMore: finalHasMore,
    billData,
    isLoadingBill,
    billError,
  } = useBillPagination({
    cardId,
    month,
    companyId,
    creditCardId: creditCard?.id,
  });

  const { isInitialLoad } = useInitialLoad({ billData, cardId, month });

  const { allTransactions } = useBillTransactions({
    billData,
    currentPage,
    cardId,
    month,
    categoryMap,
  });

  const currentBill = useCurrentBill({
    billData,
    creditCard,
    month,
    account,
    allTransactions,
  });

  const isLoading = isLoadingCard || isLoadingAccounts || (isLoadingBill && currentPage === 1);
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
