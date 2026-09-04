import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';

import { useReceivableActions } from './useReceivableActions';

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

describe('useReceivableActions', () => {
  beforeEach(() => {
    mockUpdatePayable.mockReset();
    mockUpdatePayable.mockResolvedValue(undefined);
    vi.mocked(toast).mockClear();
  });

  it('toggles status with a single API call', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useReceivableActions(), { wrapper });

    await act(async () => {
      await result.current.toggleStatus('tx-1', 'PENDING');
    });

    expect(mockUpdatePayable).toHaveBeenCalledTimes(1);
    expect(mockUpdatePayable).toHaveBeenCalledWith('tx-1', { reconciled: true });
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', title: 'Marcado como recebido' }),
    );
  });

  it('toggles received back to pending', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useReceivableActions(), { wrapper });

    await act(async () => {
      await result.current.toggleStatus('tx-1', 'RECEIVED');
    });

    expect(mockUpdatePayable).toHaveBeenCalledWith('tx-1', { reconciled: false });
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', title: 'Marcado como pendente' }),
    );
  });

  it('saves value with a single API call', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useReceivableActions(), { wrapper });

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
    const { result } = renderHook(() => useReceivableActions(), { wrapper });

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

  it('skips API when value is unchanged', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useReceivableActions(), { wrapper });

    act(() => {
      result.current.startEditing('tx-6', 42.5);
    });

    await act(async () => {
      await result.current.saveValue('tx-6');
    });

    expect(mockUpdatePayable).not.toHaveBeenCalled();
    expect(result.current.editingId).toBeNull();
  });

  it('clears togglingId after mutation completes', async () => {
    let resolveUpdate: () => void = () => {};
    mockUpdatePayable.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useReceivableActions(), { wrapper });

    let togglePromise: Promise<void> = Promise.resolve();
    act(() => {
      togglePromise = result.current.toggleStatus('tx-4', 'PENDING');
    });

    await waitFor(() => expect(result.current.togglingId).toBe('tx-4'));

    await act(async () => {
      resolveUpdate();
      await togglePromise;
    });

    expect(result.current.togglingId).toBeNull();
  });
});
