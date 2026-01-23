import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCreditCardById } from '@/services/creditCardService';
import { getAccounts } from '@/services/accountService';
import { getExtractsPaginated } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import type { CreditCard } from '@/services/creditCardService';
import type { Account } from '@/services/accountService';
import type { ExtractTransaction } from '@/services/types/extract.types';

interface BillTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
}

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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAmount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const calculateBillPeriod = (month: string, dueDay: number) => {
  const [year, monthNum] = month.split('-').map(Number);
  // O fechamento é 7 dias antes do vencimento
  // Exemplo: Vencimento dia 6 de fevereiro → Fechamento dia 30 de janeiro
  // Ciclo: Dia 31 de dezembro → Dia 30 de janeiro
  
  // Vencimento é no mês seguinte
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  
  // Calcular data de vencimento
  const dueDate = new Date(nextYear, nextMonth - 1, dueDay);
  // Fechamento = vencimento - 7 dias
  const closingDate = new Date(dueDate);
  closingDate.setDate(closingDate.getDate() - 7);
  
  // Ciclo: começa no último dia do mês anterior (dia 31)
  // e termina no dia de fechamento do mês atual
  const previousMonth = monthNum === 1 ? 12 : monthNum - 1;
  const previousYear = monthNum === 1 ? year - 1 : year;
  const daysInPreviousMonth = new Date(previousYear, previousMonth, 0).getDate();
  
  const startDate = new Date(previousYear, previousMonth - 1, daysInPreviousMonth);
  const endDate = new Date(closingDate.getFullYear(), closingDate.getMonth(), closingDate.getDate());
  
  // Formatar datas sem problemas de timezone
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

const calculateDueDate = (month: string, dueDay: number): string => {
  const [year, monthNum] = month.split('-').map(Number);
  // Vencimento é no mês seguinte ao da fatura
  // Exemplo: Fatura de janeiro (monthNum = 1), vencimento é em fevereiro (monthNum = 2, dia 6)
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`;
};

const determineBillStatus = (
  month: string,
  dueDay: number,
  currentDate: Date = new Date(),
): 'OPEN' | 'CLOSED' | 'PAID' => {
  const [year, monthNum] = month.split('-').map(Number);
  
  // Vencimento é no mês seguinte
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  const dueDate = new Date(nextYear, nextMonth - 1, dueDay);
  
  // Fechamento = vencimento - 7 dias
  const closingDate = new Date(dueDate);
  closingDate.setDate(closingDate.getDate() - 7);
  
  // A fatura está fechada se a data atual é após o dia de fechamento
  // A fatura está paga se a data atual é após o vencimento
  if (currentDate > dueDate) {
    return 'PAID';
  }
  
  if (currentDate > closingDate) {
    return 'CLOSED';
  }
  
  return 'OPEN';
};

export function useCreditCardBills(
  cardId: string,
  month: string,
): UseCreditCardBillsReturn {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [allTransactions, setAllTransactions] = useState<BillTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalAmount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

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
    // Reset state when month, cardId, or account changes
    setCurrentPage(1);
    setAllTransactions([]);
    setIsLoadingMore(false);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      totalAmount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  }, [month, cardId, creditCard?.id, account?.id]);

  useEffect(() => {
    // Reset if cardId or account changes (new card selected)
    if (!cardId || !account?.id) {
      setAllTransactions([]);
      setIsLoadingMore(false);
      return;
    }

    // Wait for extractsData to be available
    if (!extractsData) {
      if (currentPage === 1) {
        setAllTransactions([]);
      }
      if (isLoadingMore) {
        setIsLoadingMore(false);
      }
      return;
    }

    // Check if data exists and is an array
    if (!extractsData.data || !Array.isArray(extractsData.data) || extractsData.data.length === 0) {
      if (currentPage === 1) {
        setAllTransactions([]);
      }
      if (isLoadingMore) {
        setIsLoadingMore(false);
      }
      return;
    }

    // Process ALL transactions from extracts (both debits and credits)
    // No filtering by amount - we want to show all transactions
    const pageTransactions = extractsData.data.flatMap((extract, extractIndex) => {
      if (!extract?.transactions || !Array.isArray(extract.transactions) || extract.transactions.length === 0) {
        return [];
      }
      return extract.transactions.map((tx: ExtractTransaction, txIndex) => {
        const extractId = extract.id ?? `extract-${extractIndex}`;
        const uniqueId = tx.fitId
          ? `${extractId}-${tx.fitId}-${txIndex}`
          : `${extractId}-${txIndex}-${tx.date}-${tx.description}-${tx.amount}`;
        return {
          id: uniqueId,
          date: tx.date,
          description: tx.description,
          amount: tx.amount, // Keep original amount (negative for debits, positive for credits)
          category: undefined,
        };
      });
    });

    if (pageTransactions.length === 0) {
      if (currentPage === 1) {
        setAllTransactions([]);
      }
      if (isLoadingMore) {
        setIsLoadingMore(false);
      }
      return;
    }

    if (currentPage === 1) {
      const seenIds = new Set<string>();
      const uniqueTransactions = pageTransactions.filter((tx) => {
        if (seenIds.has(tx.id)) {
          return false;
        }
        seenIds.add(tx.id);
        return true;
      });
      setAllTransactions(uniqueTransactions);
    } else {
      setAllTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTransactions = pageTransactions.filter((t) => !existingIds.has(t.id));
        const seenIds = new Set<string>();
        const uniqueNewTransactions = newTransactions.filter((tx) => {
          if (seenIds.has(tx.id)) {
            return false;
          }
          seenIds.add(tx.id);
          return true;
        });
        return [...prev, ...uniqueNewTransactions];
      });
    }

    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [extractsData, currentPage, isLoadingMore, cardId, account?.id]);

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

  // Use ledgerBalance from extract header as source of truth (official balance from OFX)
  // Filter extracts by bill period to get the correct balance for the selected month
  const calculatedTotal = useMemo(() => {
    if (!extractsData?.data || !Array.isArray(extractsData.data) || extractsData.data.length === 0) {
      return 0;
    }

    if (!billPeriod) {
      return 0;
    }

    // Filter extracts by ledgerBalanceDate - this is the correct date for the balance
    // The ledgerBalanceDate should match the bill period's endDate
    const extractsInPeriod = extractsData.data.filter(extract => {
      const ledgerBalanceDate = extract.header?.ledgerBalanceDate;
      if (!ledgerBalanceDate) return false;
      
      // Check if extract's ledgerBalanceDate matches the bill period's endDate
      // Allow some flexibility (same date or within a few days)
      const balanceDate = new Date(ledgerBalanceDate);
      const billEndDate = new Date(billPeriod.endDate);
      
      // Extract is in period if ledgerBalanceDate is within 3 days of bill endDate
      const daysDiff = Math.abs((balanceDate.getTime() - billEndDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 3;
    });

    if (extractsInPeriod.length === 0) {
      return 0;
    }

    // Find extracts with ledgerBalance within the bill period
    const extractsWithLedgerBalance = extractsInPeriod.filter(
      extract => extract.header?.ledgerBalance !== undefined && extract.header.ledgerBalance !== null,
    );

    if (extractsWithLedgerBalance.length === 0) {
      return 0;
    }

    // Sort by ledgerBalanceDate (most recent first) or createdAt as fallback
    // Within the same period, use the most recent extract
    extractsWithLedgerBalance.sort((a, b) => {
      const getDate = (extract: typeof extractsWithLedgerBalance[0]) => {
        if (extract.header?.ledgerBalanceDate) {
          return new Date(extract.header.ledgerBalanceDate).getTime();
        }
        if (extract.createdAt) {
          return new Date(extract.createdAt).getTime();
        }
        return 0;
      };
      
      const dateA = getDate(a);
      const dateB = getDate(b);
      return dateB - dateA; // Most recent first
    });

    const mostRecentExtract = extractsWithLedgerBalance[0];
    const ledgerBalance = mostRecentExtract.header?.ledgerBalance ?? 0;
    
    // Use absolute value to display as positive bill balance
    // (ledgerBalance can be negative from OFX, but we display as positive in the bill)
    return Math.abs(ledgerBalance);
  }, [extractsData?.data, billPeriod]);

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
