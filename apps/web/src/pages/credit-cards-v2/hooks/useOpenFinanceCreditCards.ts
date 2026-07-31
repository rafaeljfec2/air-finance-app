import { useMemo } from 'react';

import { useAccounts } from '@/hooks/useAccounts';
import { getUserFriendlyMessage, parseApiError } from '@/utils/apiErrorHandler';

import {
  mapAccountsToOpenFinanceCreditCards,
  type OpenFinanceCreditCard,
} from '../mappers/mapAccountToOpenFinanceCreditCard';

export interface UseOpenFinanceCreditCardsResult {
  readonly cards: OpenFinanceCreditCard[];
  readonly isLoading: boolean;
  readonly error: Error | null;
}

function toCardsError(error: unknown): Error | null {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    if (message.length > 0 && message !== '[object Object]') {
      return error;
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { readonly message?: unknown }).message;
    if (typeof message === 'string') {
      const trimmed = message.trim();
      if (trimmed.length > 0 && trimmed !== '[object Object]') {
        return new Error(trimmed);
      }
    }
  }

  const apiError = parseApiError(error);
  return new Error(getUserFriendlyMessage(apiError));
}

export function useOpenFinanceCreditCards(): UseOpenFinanceCreditCardsResult {
  const { accounts, isLoading, error } = useAccounts();

  const cards = useMemo(() => mapAccountsToOpenFinanceCreditCards(accounts), [accounts]);

  return {
    cards,
    isLoading,
    error: toCardsError(error),
  };
}
