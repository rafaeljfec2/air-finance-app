import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStatement, type StatementResponse } from '@/services/bankingStatementService';
import { endOfMonth, format, parseISO } from 'date-fns';
import {
  createInitialPaginationState,
  createInitialSummary,
  type PaginationState,
  type UseStatementPaginationParams,
  type StatementSummary,
} from './types';

const ITEMS_PER_PAGE = 20;

export function useStatementPagination({
  accountId,
  month,
  companyId,
  searchTerm,
}: UseStatementPaginationParams) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>(createInitialPaginationState());
  const [monthSummary, setMonthSummary] = useState<StatementSummary>(createInitialSummary());
  const previousMonthRef = useRef<string>(month);
  const previousAccountIdRef = useRef<string>(accountId);
  const previousSearchRef = useRef<string | undefined>(searchTerm);
  const summaryLoadedRef = useRef<boolean>(false);

  const startDate = `${month}-01`;
  const endDate = format(endOfMonth(parseISO(startDate)), 'yyyy-MM-dd');

  const {
    data: statementData,
    isLoading: isLoadingStatement,
    isFetching,
    error: statementError,
  } = useQuery<StatementResponse>({
    queryKey: ['account-statement', companyId, accountId, month, currentPage, searchTerm],
    queryFn: () =>
      getStatement(companyId, {
        accountId,
        startDate,
        endDate,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
      }),
    enabled: !!companyId && !!accountId && !!month,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: (previousData) => {
      if (previousData?.page === currentPage) {
        return previousData;
      }
      return undefined;
    },
  });

  useEffect(() => {
    const monthChanged = previousMonthRef.current !== month;
    const accountChanged = previousAccountIdRef.current !== accountId;
    const searchChanged = previousSearchRef.current !== searchTerm;

    if (monthChanged || accountChanged || searchChanged) {
      previousMonthRef.current = month;
      previousAccountIdRef.current = accountId;
      previousSearchRef.current = searchTerm;
      setCurrentPage(1);
      setIsLoadingMore(false);
      setPagination(createInitialPaginationState());
      if (!searchChanged) {
        setMonthSummary(createInitialSummary());
        summaryLoadedRef.current = false;
      }
    }
  }, [accountId, month, searchTerm]);

  useEffect(() => {
    if (statementData) {
      const total = statementData.total ?? statementData.transactions.length;
      const limit = statementData.limit ?? ITEMS_PER_PAGE;
      const page = statementData.page ?? currentPage;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      setPagination({
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      });

      if (!summaryLoadedRef.current && statementData.summary) {
        setMonthSummary(statementData.summary);
        summaryLoadedRef.current = true;
      }
    }
  }, [statementData, currentPage]);

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
    statementData,
    isLoadingStatement,
    statementError,
    monthSummary,
  };
}
