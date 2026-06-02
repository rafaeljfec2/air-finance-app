import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePayableMutation } from './usePayableMutation';

const mockUpdateTransactionAsync = vi.fn();

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    updateTransactionAsync: mockUpdateTransactionAsync,
    isUpdating: false,
  }),
}));

vi.mock('@/stores/company', () => ({
  useCompanyStore: () => ({
    activeCompany: { id: 'company-1' },
  }),
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('usePayableMutation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mockUpdateTransactionAsync.mockReset();
    mockUpdateTransactionAsync.mockResolvedValue(undefined);
  });

  it('awaits updateTransactionAsync before resolving', async () => {
    let resolveUpdate: () => void = () => {};
    const updatePromise = new Promise<void>((resolve) => {
      resolveUpdate = resolve;
    });
    mockUpdateTransactionAsync.mockReturnValue(updatePromise);

    const { result } = renderHook(() => usePayableMutation(), {
      wrapper: createWrapper(queryClient),
    });

    const mutationPromise = result.current.updatePayable('tx-1', { reconciled: true });
    expect(mockUpdateTransactionAsync).toHaveBeenCalledWith({
      id: 'tx-1',
      data: { reconciled: true },
    });

    let settled = false;
    void mutationPromise.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    resolveUpdate();
    await mutationPromise;
    expect(settled).toBe(true);
  });

  it('invalidates budget and transactions queries on success', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => usePayableMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.updatePayable('tx-2', { value: 100 });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['budget', 'company-1'] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['transactions', 'company-1'] });
    });
  });

  it('rethrows when updateTransactionAsync fails', async () => {
    mockUpdateTransactionAsync.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => usePayableMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(result.current.updatePayable('tx-3', { value: 50 })).rejects.toThrow(
      'network error',
    );
  });
});
