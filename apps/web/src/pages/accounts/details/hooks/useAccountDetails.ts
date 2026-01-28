import { useMemo } from 'react';
import { useCompanyStore } from '@/stores/company';
import { endOfMonth, format, parseISO } from 'date-fns';
import { useAccountQueries } from './useAccountQueries';
import { useStatementPagination } from './useStatementPagination';
import { useStatementTransactions } from './useStatementTransactions';
import { useInitialLoad } from './useInitialLoad';
import type { UseAccountDetailsReturn, CurrentStatement } from './types';
import { createInitialSummary } from './types';

export function useAccountDetails(accountId: string, month: string): UseAccountDetailsReturn {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const { account, accounts, isLoadingAccount, isLoadingAccounts, accountError, accountsError } =
    useAccountQueries({
      companyId,
      accountId,
    });

  const {
    currentPage,
    isLoadingMore: finalIsLoadingMore,
    pagination: finalPagination,
    loadMore: finalLoadMore,
    hasMore: finalHasMore,
    statementData,
    isLoadingStatement,
    statementError,
  } = useStatementPagination({
    accountId,
    month,
    companyId,
  });

  const { isInitialLoad } = useInitialLoad({ statementData, accountId, month });

  const { allTransactions } = useStatementTransactions({
    statementData,
    currentPage,
    accountId,
    month,
  });

  const currentStatement = useMemo<CurrentStatement | null>(() => {
    if (!statementData && allTransactions.length === 0) {
      return null;
    }

    const startDate = `${month}-01`;
    const endDate = format(endOfMonth(parseISO(startDate)), 'yyyy-MM-dd');

    const summary = statementData?.summary ?? createInitialSummary();

    return {
      transactions: allTransactions,
      summary: {
        startBalance: summary.startBalance,
        endBalance: summary.endBalance,
        totalCredits: summary.totalCredits,
        totalDebits: summary.totalDebits,
      },
      periodStart: startDate,
      periodEnd: endDate,
    };
  }, [statementData, allTransactions, month]);

  const isLoading =
    isLoadingAccount || isLoadingAccounts || (isLoadingStatement && currentPage === 1);
  const error = accountError ?? accountsError ?? statementError;

  return {
    account,
    accounts,
    currentStatement,
    isLoading,
    isLoadingMore: finalIsLoadingMore,
    isInitialLoad,
    error: error ?? null,
    pagination: finalPagination,
    loadMore: finalLoadMore,
    hasMore: finalHasMore,
  };
}
