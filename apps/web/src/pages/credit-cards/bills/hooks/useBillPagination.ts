import { useState, useEffect, useCallback, useRef } from 'react';
import { createInitialPaginationState, type PaginationState } from './utils/stateManagement';
import type { CreditCardBillResponse } from '@/services/creditCardService';

interface UseBillPaginationParams {
  cardId: string;
  month: string;
  billData?: CreditCardBillResponse;
  isFetching: boolean;
}

export const useBillPagination = ({
  cardId,
  month,
  billData,
  isFetching,
}: UseBillPaginationParams) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>(createInitialPaginationState());
  const previousMonthRef = useRef<string>(month);
  const previousCardIdRef = useRef<string>(cardId);

  useEffect(() => {
    const monthChanged = previousMonthRef.current !== month;
    const cardChanged = previousCardIdRef.current !== cardId;

    if (monthChanged || cardChanged) {
      previousMonthRef.current = month;
      previousCardIdRef.current = cardId;
      setCurrentPage(1);
      setIsLoadingMore(false);
      setPagination(createInitialPaginationState());
    }
  }, [cardId, month]);

  useEffect(() => {
    if (billData?.pagination) {
      setPagination({
        page: billData.pagination.page,
        limit: billData.pagination.limit,
        total: billData.pagination.total,
        totalPages: billData.pagination.totalPages,
        totalAmount: billData.pagination.totalAmount,
        hasNextPage: billData.pagination.hasNextPage,
        hasPreviousPage: billData.pagination.hasPreviousPage,
      });
    }
  }, [billData?.pagination]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || isFetching || !pagination.hasNextPage) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      if (nextPage <= pagination.totalPages) {
        setCurrentPage(nextPage);
      } else {
        setIsLoadingMore(false);
      }
    } catch (error) {
      console.error('Error loading more extracts:', error);
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, isFetching, pagination.hasNextPage, pagination.totalPages, currentPage]);

  return {
    currentPage,
    isLoadingMore,
    pagination,
    loadMore,
    hasMore: pagination.hasNextPage,
  };
};
