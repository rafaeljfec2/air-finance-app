import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRecurringTransaction } from '@/services/recurringTransactionService';
import type { CreateTransactionPayload } from '@/services/transactionService';

import { useTransactionForm } from './useTransactionForm';

const mockNavigate = vi.fn();
const mockCreateTransaction = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()],
}));

vi.mock('@/stores/company', () => ({
  useCompanyStore: () => ({ activeCompany: { id: 'company-1' } }),
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    createTransaction: mockCreateTransaction,
    isCreating: false,
  }),
}));

vi.mock('@/services/recurringTransactionService', () => ({
  createRecurringTransaction: vi.fn(),
}));

vi.mock('@/components/ui/toast', () => ({
  toast: vi.fn(),
}));

const mockCreateRecurring = vi.mocked(createRecurringTransaction);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: Readonly<{ children: ReactNode }>) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function fillValidForm(result: { current: ReturnType<typeof useTransactionForm> }) {
  act(() => {
    result.current.handleChange({
      target: { name: 'description', value: 'Mercado' },
    } as ChangeEvent<HTMLInputElement>);
    result.current.handleSelectChange('accountId', 'acc-1');
    result.current.handleSelectChange('categoryId', 'cat-1');
    result.current.handleSelectChange('amount', 150);
  });
}

function fillValidRecurringForm(result: { current: ReturnType<typeof useTransactionForm> }) {
  fillValidForm(result);
  act(() => {
    result.current.handleSelectChange('transactionKind', 'FIXED');
    result.current.handleSelectChange('recurrenceStartDate', '2026-07-01');
    result.current.handleSelectChange('recurrenceEndDate', '2026-12-31');
    result.current.handleSelectChange('recurrenceFrequency', 'monthly');
  });
}

async function submitForm(result: { current: ReturnType<typeof useTransactionForm> }) {
  await act(async () => {
    await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
  });
}

describe('useTransactionForm success handling', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockCreateTransaction.mockReset();
    mockCreateRecurring.mockReset();
    sessionStorage.clear();
    mockCreateTransaction.mockImplementation(
      (_payload: CreateTransactionPayload, options?: { onSuccess?: () => void }) => {
        options?.onSuccess?.();
      },
    );
    mockCreateRecurring.mockResolvedValue({
      id: 'rec-1',
      companyId: 'company-1',
      description: 'Mercado',
      type: 'Expense',
      value: 150,
      category: 'cat-1',
      accountId: 'acc-1',
      startDate: '2026-07-01',
      frequency: 'monthly',
      repeatUntil: '2026-12-31',
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
    });
  });

  it('navigates to /transactions by default after creating', async () => {
    const { result } = renderHook(() => useTransactionForm(), { wrapper: createWrapper() });

    fillValidForm(result);
    await submitForm(result);

    expect(mockCreateTransaction).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/transactions');
  });

  it('calls onSuccess instead of navigating when provided', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useTransactionForm({ onSuccess }), {
      wrapper: createWrapper(),
    });

    fillValidForm(result);
    await submitForm(result);

    expect(mockCreateTransaction).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls onSuccess for recurring transactions without navigating', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useTransactionForm({ onSuccess }), {
      wrapper: createWrapper(),
    });

    fillValidRecurringForm(result);
    await submitForm(result);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(mockCreateRecurring).toHaveBeenCalledTimes(1);
    expect(mockCreateTransaction).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates by default for recurring transactions', async () => {
    const { result } = renderHook(() => useTransactionForm(), { wrapper: createWrapper() });

    fillValidRecurringForm(result);
    await submitForm(result);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/transactions'));
    expect(mockCreateRecurring).toHaveBeenCalledTimes(1);
  });
});

describe('useTransactionForm draft persistence', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockCreateTransaction.mockReset();
    sessionStorage.clear();
  });

  it('loads and saves draft by default', () => {
    sessionStorage.setItem('transaction_draft', JSON.stringify({ description: 'Rascunho antigo' }));

    const { result } = renderHook(() => useTransactionForm(), { wrapper: createWrapper() });

    expect(result.current.formData.description).toBe('Rascunho antigo');
  });

  it('does not load an existing draft when persistDraft is false', () => {
    sessionStorage.setItem('transaction_draft', JSON.stringify({ description: 'Rascunho antigo' }));

    const { result } = renderHook(() => useTransactionForm({ persistDraft: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.formData.description).toBe('');
  });

  it('does not write a draft when persistDraft is false', () => {
    const { result } = renderHook(() => useTransactionForm({ persistDraft: false }), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleChange({
        target: { name: 'description', value: 'Sem rascunho' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(sessionStorage.getItem('transaction_draft')).toBeNull();
  });
});
