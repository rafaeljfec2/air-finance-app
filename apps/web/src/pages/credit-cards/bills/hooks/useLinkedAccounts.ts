import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { hasBankingIntegration } from '@/services/accountHelpers';
import { getAccounts, type Account } from '@/services/accountService';
import type { CreditCard } from '@/services/creditCardService';

interface UseLinkedAccountsParams {
  readonly companyId: string;
  readonly creditCards: ReadonlyArray<CreditCard>;
}

export function useLinkedAccounts({ companyId, creditCards }: UseLinkedAccountsParams) {
  const { data: accounts } = useQuery<Account[]>({
    queryKey: ['accounts', companyId],
    queryFn: () => getAccounts(companyId),
    enabled: !!companyId,
  });

  const linkedAccountIds = useMemo(() => {
    if (!accounts || creditCards.length === 0) return {};

    const creditCardAccounts = accounts.filter(
      (acc) => acc.type === 'credit_card' && hasBankingIntegration(acc),
    );

    const map: Record<string, string> = {};
    for (const card of creditCards) {
      const linked = creditCardAccounts.find((acc) => acc.name === card.name);
      if (linked) {
        map[card.id] = linked.id;
      }
    }
    return map;
  }, [accounts, creditCards]);

  return { linkedAccountIds };
}
