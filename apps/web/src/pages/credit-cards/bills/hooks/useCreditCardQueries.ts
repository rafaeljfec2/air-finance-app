import { useQuery } from '@tanstack/react-query';
import { getCreditCardById, CreditCard } from '@/services/creditCardService';
import { getAccounts, type Account } from '@/services/accountService';

interface UseCreditCardQueriesParams {
  companyId: string;
  cardId: string;
}

export const useCreditCardQueries = ({ companyId, cardId }: UseCreditCardQueriesParams) => {
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

  return {
    creditCard: creditCard ?? null,
    account,
    isLoadingCard,
    isLoadingAccounts,
    cardError,
    accountsError,
  };
};
