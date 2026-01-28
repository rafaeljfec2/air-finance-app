import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCreditCardBill, type CreditCardBillResponse } from '@/services/creditCardService';
import { createInitialPaginationState, type PaginationState } from './utils/stateManagement';

interface UseBillPaginationParams {
  cardId: string;
  month: string;
  companyId: string;
  creditCardId?: string;
  searchTerm?: string;
}

export const useBillPagination = ({
  cardId,
  month,
  companyId,
  creditCardId,
  searchTerm,
}: UseBillPaginationParams) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>(createInitialPaginationState());
  const previousMonthRef = useRef<string>(month);
  const previousCardIdRef = useRef<string>(cardId);
  const previousSearchRef = useRef<string | undefined>(searchTerm);

  const {
    data: billData,
    isLoading: isLoadingBill,
    isFetching,
    error: billError,
  } = useQuery<CreditCardBillResponse>({
    queryKey: ['credit-card-bill', companyId, cardId, month, currentPage, searchTerm],
    queryFn: () =>
      getCreditCardBill(companyId, cardId, month, { page: currentPage, limit: 10 }, searchTerm),
    enabled: !!companyId && !!cardId && !!month && !!creditCardId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: (previousData) => {
      if (previousData && previousData.pagination?.page === currentPage) {
        return previousData;
      }
      return undefined;
    },
  });

  useEffect(() => {
    const monthChanged = previousMonthRef.current !== month;
    const cardChanged = previousCardIdRef.current !== cardId;
    const searchChanged = previousSearchRef.current !== searchTerm;

    if (monthChanged || cardChanged || searchChanged) {
      previousMonthRef.current = month;
      previousCardIdRef.current = cardId;
      previousSearchRef.current = searchTerm;
      setCurrentPage(1);
      setIsLoadingMore(false);
      setPagination(createInitialPaginationState());
    }
  }, [cardId, month, searchTerm]);

  useEffect(() => {
    if (billData?.pagination) {
      const newPagination = {
        page: billData.pagination.page,
        limit: billData.pagination.limit,
        total: billData.pagination.total,
        totalPages: billData.pagination.totalPages,
        totalAmount: billData.pagination.totalAmount,
        hasNextPage: billData.pagination.hasNextPage,
        hasPreviousPage: billData.pagination.hasPreviousPage,
      };
      setPagination(newPagination);
    }
  }, [billData?.pagination]);

  const previousIsFetchingRef = useRef<boolean>(isFetching);

  useEffect(() => {
    const wasFetching = previousIsFetchingRef.current;
    previousIsFetchingRef.current = isFetching;

    if (wasFetching && !isFetching && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [isFetching, isLoadingMore]);

  const loadMoreRef = useRef<boolean>(false);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || isFetching || !pagination.hasNextPage || loadMoreRef.current) {
      return;
    }

    loadMoreRef.current = true;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    if (nextPage <= pagination.totalPages) {
      setCurrentPage(nextPage);
    } else {
      setIsLoadingMore(false);
      loadMoreRef.current = false;
    }
  }, [isLoadingMore, isFetching, pagination.hasNextPage, pagination.totalPages, currentPage]);

  useEffect(() => {
    if (!isFetching && isLoadingMore) {
      loadMoreRef.current = false;
    }
  }, [isFetching, isLoadingMore]);

  return {
    currentPage,
    isLoadingMore,
    pagination,
    loadMore,
    hasMore: pagination.hasNextPage,
    isFetching,
    billData,
    isLoadingBill,
    billError,
  };
};
