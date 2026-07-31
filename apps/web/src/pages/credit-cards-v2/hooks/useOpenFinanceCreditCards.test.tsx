import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Account } from '@/services/accountService';

import { useOpenFinanceCreditCards } from './useOpenFinanceCreditCards';

const mockUseAccounts = vi.fn();

vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: () => mockUseAccounts(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { readonly children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

function buildOfCardAccount(): Account {
  return {
    id: 'mongo-1',
    name: 'OF Card',
    type: 'credit_card',
    extractBalance: { initial: 0, date: null, enabled: true },
    cashFlowBalance: { initial: 0, date: null, enabled: true },
    bankDetails: { accountNumber: '9999' },
    integration: {
      enabled: true,
      openFinance: {
        itemId: 'item-1',
        accountId: 'card-openi-1',
        status: 'CONNECTED',
      },
    },
  } as Account;
}

describe('useOpenFinanceCreditCards', () => {
  beforeEach(() => {
    mockUseAccounts.mockReset();
  });

  it('returns empty cards while loading', () => {
    mockUseAccounts.mockReturnValue({
      accounts: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useOpenFinanceCreditCards(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.cards).toEqual([]);
  });

  it('maps open finance credit card accounts', async () => {
    mockUseAccounts.mockReturnValue({
      accounts: [
        buildOfCardAccount(),
        { ...buildOfCardAccount(), id: 'checking', type: 'checking' },
      ],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useOpenFinanceCreditCards(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.cards).toHaveLength(1));
    expect(result.current.cards[0]?.openiCardId).toBe('card-openi-1');
  });

  it('surfaces accounts error', () => {
    mockUseAccounts.mockReturnValue({
      accounts: undefined,
      isLoading: false,
      error: new Error('Failed to load accounts'),
    });

    const { result } = renderHook(() => useOpenFinanceCreditCards(), {
      wrapper: createWrapper(),
    });

    expect(result.current.error?.message).toBe('Failed to load accounts');
  });

  it('normalizes plain object errors instead of [object Object]', () => {
    mockUseAccounts.mockReturnValue({
      accounts: undefined,
      isLoading: false,
      error: { message: 'Conta indisponível', status: 500 },
    });

    const { result } = renderHook(() => useOpenFinanceCreditCards(), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Conta indisponível');
  });

  it('returns empty cards without error when accounts list is empty', () => {
    mockUseAccounts.mockReturnValue({
      accounts: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useOpenFinanceCreditCards(), {
      wrapper: createWrapper(),
    });

    expect(result.current.cards).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
