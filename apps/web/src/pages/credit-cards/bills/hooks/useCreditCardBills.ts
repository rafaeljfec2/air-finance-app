import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCreditCardById } from '@/services/creditCardService';
import { getAccounts } from '@/services/accountService';
import { getExtractsPaginated } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import type { CreditCard } from '@/services/creditCardService';
import type { Account } from '@/services/accountService';
import { calculateBillPeriod, calculateDueDate, determineBillStatus } from './utils/billCalculations';
import { processExtractTransactions, type BillTransaction } from './utils/transactionProcessing';
import { getLedgerBalanceFromExtracts } from './utils/ledgerBalance';
import { canProcessExtracts, isValidExtractData } from './utils/validation';
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
  error: Error | null;
  pagination: PaginationState;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useCreditCardBills(
  cardId: string,
  month: string,
): UseCreditCardBillsReturn {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [allTransactions, setAllTransactions] = useState<BillTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>(createInitialPaginationState());

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

  const account = useMemo(() => {
    if (!creditCard || !accounts) {
      return null;
    }
    return (
      accounts.find(
        (acc) => acc.type === 'credit_card' && acc.name === creditCard.name,
      ) ?? null
    );
  }, [accounts, creditCard]);

  const billPeriod = useMemo(() => {
    return creditCard && month
      ? calculateBillPeriod(month, creditCard.dueDay)
      : null;
  }, [creditCard, month]);

  const {
    data: extractsData,
    isLoading: isLoadingExtracts,
    error: extractsError,
    isFetching,
  } = useQuery({
    queryKey: [
      'extracts-paginated',
      companyId,
      cardId,
      creditCard?.id,
      account?.id,
      month,
      billPeriod?.startDate,
      billPeriod?.endDate,
      currentPage,
    ],
    queryFn: async () => {
      if (!billPeriod || !account?.id) {
        return null;
      }
      return getExtractsPaginated(
        companyId,
        billPeriod.startDate,
        billPeriod.endDate,
        account.id,
        { page: currentPage, limit: 10 },
      );
    },
    enabled: !!billPeriod && !!account?.id && !!companyId && !!cardId && !!creditCard?.id && !!month,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: undefined,
  });

  useEffect(() => {
    if (extractsData?.pagination) {
      setPagination(extractsData.pagination);
    }
  }, [extractsData?.pagination]);

  useEffect(() => {
    setCurrentPage(1);
    setAllTransactions([]);
    setIsLoadingMore(false);
    setPagination(createInitialPaginationState());
  }, [month, cardId, creditCard?.id, account?.id]);

  const resetStateForEmptyData = useCallback(
    (shouldResetTransactions: boolean) => {
      if (shouldResetTransactions) {
        setAllTransactions([]);
      }
      if (isLoadingMore) {
        setIsLoadingMore(false);
      }
    },
    [isLoadingMore],
  );

  useEffect(() => {
    if (!cardId || !account?.id) {
      setAllTransactions([]);
      setIsLoadingMore(false);
      return;
    }

    if (!canProcessExtracts(cardId, account.id, extractsData)) {
      resetStateForEmptyData(currentPage === 1);
      return;
    }

    if (!extractsData?.data) {
      resetStateForEmptyData(currentPage === 1);
      return;
    }

    const pageTransactions = processExtractTransactions(extractsData.data);

    if (pageTransactions.length === 0) {
      resetStateForEmptyData(currentPage === 1);
      return;
    }

    updateTransactionsState(pageTransactions, currentPage, allTransactions, setAllTransactions);

    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [
    extractsData,
    currentPage,
    isLoadingMore,
    cardId,
    account?.id,
    resetStateForEmptyData,
    allTransactions,
  ]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || isFetching || !pagination.hasNextPage || !billPeriod || !account?.id) {
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
  }, [
    isLoadingMore,
    isFetching,
    pagination.hasNextPage,
    pagination.totalPages,
    billPeriod,
    account?.id,
    currentPage,
  ]);

  const calculatedTotal = useMemo(() => {
    if (!isValidExtractData(extractsData) || !billPeriod || !extractsData?.data) {
      return 0;
    }
    return getLedgerBalanceFromExtracts(extractsData.data, billPeriod);
  }, [extractsData, billPeriod]);

  const currentBill: CurrentBill | null =
    creditCard && month && account
      ? {
          id: `${account.id}-${month}`,
          cardId: creditCard.id,
          month,
          total: calculatedTotal,
          dueDate: calculateDueDate(month, creditCard.dueDay),
          status: determineBillStatus(month, creditCard.dueDay),
          transactions: allTransactions,
        }
      : null;

  const isLoading =
    isLoadingCard || isLoadingAccounts || (isLoadingExtracts && currentPage === 1);
  const error = cardError ?? accountsError ?? extractsError;

  return {
    creditCard: creditCard ?? null,
    account,
    currentBill,
    isLoading,
    isLoadingMore,
    error: error ?? null,
    pagination,
    loadMore,
    hasMore: pagination.hasNextPage,
  };
}
