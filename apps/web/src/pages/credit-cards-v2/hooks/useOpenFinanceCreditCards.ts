import { useMemo } from 'react';

import { useAccounts } from '@/hooks/useAccounts';

import {
  mapAccountsToOpenFinanceCreditCards,
  type OpenFinanceCreditCard,
} from '../mappers/mapAccountToOpenFinanceCreditCard';

export interface UseOpenFinanceCreditCardsResult {
  readonly cards: OpenFinanceCreditCard[];
  readonly isLoading: boolean;
  readonly error: Error | null;
}

export function useOpenFinanceCreditCards(): UseOpenFinanceCreditCardsResult {
  const { accounts, isLoading, error } = useAccounts();

  const cards = useMemo(() => mapAccountsToOpenFinanceCreditCards(accounts), [accounts]);

  return {
    cards,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
  };
}
