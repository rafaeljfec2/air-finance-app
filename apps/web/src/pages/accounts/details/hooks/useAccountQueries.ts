import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccountById, getAccounts, type Account } from '@/services/accountService';

interface UseAccountQueriesParams {
  readonly companyId: string;
  readonly accountId: string;
}

export function useAccountQueries({ companyId, accountId }: UseAccountQueriesParams) {
  const queryClient = useQueryClient();

  const {
    data: account,
    isLoading: isLoadingAccount,
    error: accountError,
  } = useQuery<Account>({
    queryKey: ['account', companyId, accountId],
    queryFn: () => getAccountById(companyId, accountId),
    enabled: !!companyId && !!accountId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useQuery<Account[]>({
    queryKey: ['accounts', companyId],
    queryFn: () => getAccounts(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.filter((acc) => acc.type !== 'credit_card'),
  });

  useEffect(() => {
    if (!account || !companyId) return;

    queryClient.setQueryData<Account[]>(['accounts', companyId], (prev) => {
      if (!prev) return prev;

      const needsUpdate = prev.some(
        (acc) => acc.id === account.id && acc.currentBalance !== account.currentBalance,
      );

      if (!needsUpdate) return prev;

      return prev.map((acc) => (acc.id === account.id ? account : acc));
    });
  }, [account, companyId, queryClient]);

  return {
    account: account ?? null,
    accounts: accounts ?? [],
    isLoadingAccount,
    isLoadingAccounts,
    accountError,
    accountsError,
  };
}
