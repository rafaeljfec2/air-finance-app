import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getCreditCardById,
  getCreditCardBill,
  type CreditCardBillResponse,
  CreditCard,
} from '@/services/creditCardService';
import { getAccounts } from '@/services/accountService';
import { useCompanyStore } from '@/stores/company';
import type { Account } from '@/services/accountService';
import { processExtractTransactions, type BillTransaction } from './utils/transactionProcessing';
import {
  createInitialPaginationState,
  updateTransactionsState,
  type PaginationState,
} from './utils/stateManagement';

interface CurrentBill {
  id: string;
  cardId: string;
  month: string;
  total: number;
  dueDate: string;
  status: 'OPEN' | 'CLOSED' | 'PAID';
  transactions: BillTransaction[];
}

interface UseCreditCardBillsReturn {
  creditCard: CreditCard | null;
  account: Account | null;
  currentBill: CurrentBill | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isInitialLoad: boolean;
  error: Error | null;
  pagination: PaginationState;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useCreditCardBills(cardId: string, month: string): UseCreditCardBillsReturn {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [allTransactions, setAllTransactions] = useState<BillTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>(createInitialPaginationState());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    data: creditCard,
    isLoading: isLoadingCard,
    error: cardError,
  } = useQuery<CreditCard>({
    queryKey: ['credit-card', companyId, cardId],
    queryFn: () => getCreditCardById(companyId, cardId),
    enabled: !!companyId && !!cardId,
  });

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useQuery<Account[]>({
    queryKey: ['accounts', companyId],
    queryFn: () => getAccounts(companyId),
    enabled: !!companyId,
  });

  const account =
    accounts?.find((acc) => acc.type === 'credit_card' && acc.name === creditCard?.name) ?? null;

  const {
    data: billData,
    isLoading: isLoadingBill,
    error: billError,
    isFetching,
  } = useQuery<CreditCardBillResponse>({
    queryKey: ['credit-card-bill', companyId, cardId, month, currentPage],
    queryFn: () => getCreditCardBill(companyId, cardId, month, { page: currentPage, limit: 10 }),
    enabled: !!companyId && !!cardId && !!month && !!creditCard?.id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: (previousData) => previousData,
  });

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
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      if (!billData?.data) {
        return;
      }
    }

    if (billData && isInitialLoad) {
      setIsInitialLoad(false);
    }

    if (!billData?.data) {
      if (!(monthChanged || cardChanged)) {
        setAllTransactions([]);
        setIsLoadingMore(false);
      }
      return;
    }

    const pageTransactions = processExtractTransactions(billData.data.transactions);

    if (pageTransactions.length === 0) {
      if (!(monthChanged || cardChanged)) {
        setAllTransactions([]);
        setIsLoadingMore(false);
      }
      return;
    }

    if (monthChanged || cardChanged) {
      setAllTransactions(pageTransactions);
    } else {
      updateTransactionsState(pageTransactions, currentPage, allTransactions, setAllTransactions);
    }

    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [billData, currentPage, isLoadingMore, cardId, month, allTransactions, isInitialLoad]);

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

  const previousBillRef = useRef<CurrentBill | null>(null);

  const currentBill: CurrentBill | null = useMemo(() => {
    if (billData?.data && creditCard && month && account) {
      const bill: CurrentBill = {
        id: billData.data.id,
        cardId: billData.data.cardId,
        month: billData.data.month,
        total: billData.data.total,
        dueDate: billData.data.dueDate,
        status: billData.data.status,
        transactions: allTransactions.length > 0 ? allTransactions : [],
      };
      previousBillRef.current = bill;
      return bill;
    }
    return previousBillRef.current;
  }, [billData?.data, creditCard, month, account, allTransactions]);

  const isLoading = isLoadingCard || isLoadingAccounts || (isLoadingBill && currentPage === 1);
  const error = cardError ?? accountsError ?? billError;

  return {
    creditCard: creditCard ?? null,
    account,
    currentBill,
    isLoading,
    isLoadingMore,
    isInitialLoad,
    error: error ?? null,
    pagination,
    loadMore,
    hasMore: pagination.hasNextPage,
  };
}
