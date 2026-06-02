import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';

import { usePayableActions } from './usePayableActions';

const mockUpdatePayable = vi.fn();

vi.mock('./usePayableMutation', () => ({
  usePayableMutation: () => ({
    updatePayable: mockUpdatePayable,
    isUpdating: false,
  }),
}));

vi.mock('@/components/ui/toast', () => ({
  toast: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

describe('usePayableActions', () => {
  beforeEach(() => {
    mockUpdatePayable.mockReset();
    mockUpdatePayable.mockResolvedValue(undefined);
    vi.mocked(toast).mockClear();
  });

  it('toggles status with a single API call', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    await act(async () => {
      await result.current.toggleStatus('tx-1', 'PENDING');
    });

    expect(mockUpdatePayable).toHaveBeenCalledTimes(1);
    expect(mockUpdatePayable).toHaveBeenCalledWith('tx-1', { reconciled: true });
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', title: 'Marcado como pago' }),
    );
  });

  it('does not toggle credit card payables', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    expect(result.current.isToggleable('card-bill-1')).toBe(false);

    await act(async () => {
      await result.current.toggleStatus('card-bill-1', 'PENDING');
    });

    expect(mockUpdatePayable).not.toHaveBeenCalled();
  });

  it('saves value with a single API call', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    act(() => {
      result.current.startEditing('tx-2', 150.5);
    });

    act(() => {
      result.current.handleValueChange('200,75');
    });

    await act(async () => {
      await result.current.saveValue('tx-2');
    });

    expect(mockUpdatePayable).toHaveBeenCalledTimes(1);
    expect(mockUpdatePayable).toHaveBeenCalledWith('tx-2', { value: 200.75 });
    expect(result.current.editingId).toBeNull();
  });

  it('shows error toast and skips API for invalid value', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    act(() => {
      result.current.startEditing('tx-3', 10);
      result.current.handleValueChange('abc');
    });

    await act(async () => {
      await result.current.saveValue('tx-3');
    });

    expect(mockUpdatePayable).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', title: 'Valor inválido' }),
    );
  });

  it('does not call API twice when save runs after editing was cleared', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    act(() => {
      result.current.startEditing('tx-5', 100);
      result.current.handleValueChange('150');
    });

    await act(async () => {
      await result.current.saveValue('tx-5');
    });

    expect(mockUpdatePayable).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.saveValue('tx-5');
    });

    expect(mockUpdatePayable).toHaveBeenCalledTimes(1);
  });

  it('skips API when value is unchanged', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    act(() => {
      result.current.startEditing('tx-6', 42.5);
    });

    await act(async () => {
      await result.current.saveValue('tx-6');
    });

    expect(mockUpdatePayable).not.toHaveBeenCalled();
    expect(result.current.editingId).toBeNull();
  });

  it('does not save value for credit card payables', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    expect(result.current.isValueEditable('card-acc-2026-05')).toBe(false);

    act(() => {
      result.current.startEditing('card-acc-2026-05', 500);
    });

    expect(result.current.editingId).toBeNull();

    await act(async () => {
      await result.current.saveValue('card-acc-2026-05');
    });

    expect(mockUpdatePayable).not.toHaveBeenCalled();
  });

  it('ignores duplicate blur save after Enter', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    act(() => {
      result.current.startEditing('tx-7', 10);
      result.current.handleValueChange('20');
    });

    act(() => {
      const preventDefault = vi.fn();
      result.current.handleKeyDown(
        { key: 'Enter', preventDefault } as unknown as React.KeyboardEvent<HTMLInputElement>,
        'tx-7',
      );
    });

    await waitFor(() => expect(mockUpdatePayable).toHaveBeenCalledTimes(1));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      result.current.commitValueOnBlur('tx-7');
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    expect(mockUpdatePayable).toHaveBeenCalledTimes(1);
  });

  it('clears togglingId after mutation completes', async () => {
    let resolveUpdate: () => void = () => {};
    mockUpdatePayable.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePayableActions(), { wrapper });

    let togglePromise: Promise<void> = Promise.resolve();
    act(() => {
      togglePromise = result.current.toggleStatus('tx-4', 'PAID');
    });

    await waitFor(() => expect(result.current.togglingId).toBe('tx-4'));

    await act(async () => {
      resolveUpdate();
      await togglePromise;
    });

    expect(result.current.togglingId).toBeNull();
  });
});
