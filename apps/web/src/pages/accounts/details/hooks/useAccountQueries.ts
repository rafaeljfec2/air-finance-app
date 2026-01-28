import { useQuery } from '@tanstack/react-query';
import { getAccountById, getAccounts, type Account } from '@/services/accountService';

interface UseAccountQueriesParams {
  readonly companyId: string;
  readonly accountId: string;
}

export function useAccountQueries({ companyId, accountId }: UseAccountQueriesParams) {
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

  return {
    account: account ?? null,
    accounts: accounts ?? [],
    isLoadingAccount,
    isLoadingAccounts,
    accountError,
    accountsError,
  };
}
