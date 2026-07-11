import { act, renderHook } from '@testing-library/react';
import type { FormEvent, KeyboardEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTransactionForm } from '../useTransactionForm';

const mockNavigate = vi.fn();
const mockAddTransaction = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/stores/transaction', () => ({
  useTransactionStore: () => ({
    addTransaction: mockAddTransaction,
  }),
}));

vi.mock('@/stores/company', () => ({
  useCompanyStore: () => ({
    activeCompany: { id: 'company-1' },
  }),
}));

describe('useTransactionForm', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockAddTransaction.mockReset();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTransactionForm());

    expect(result.current.formData).toEqual({
      description: '',
      amount: '',
      type: 'EXPENSE',
      category: {
        id: '',
        name: '',
        icon: '',
        color: '',
      },
      date: expect.any(String),
      note: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showSuccessTooltip).toBe(false);
  });

  it('updates field value and clears description error when filled', () => {
    const { result } = renderHook(() => useTransactionForm());

    act(() => {
      result.current.updateFormData('description', '');
    });
    expect(result.current.errors.description).toBe('Description is required');

    act(() => {
      result.current.updateFormData('description', 'Teste');
    });
    expect(result.current.formData.description).toBe('Teste');
    expect(result.current.errors.description).toBe('');
  });

  it('validates required fields in real time', () => {
    const { result } = renderHook(() => useTransactionForm());

    act(() => {
      result.current.updateFormData('description', '');
    });
    expect(result.current.errors.description).toBe('Description is required');

    act(() => {
      result.current.updateFormData('description', 'Teste');
    });
    expect(result.current.errors.description).toBe('');

    act(() => {
      result.current.updateFormData('amount', '0');
    });
    expect(result.current.errors.amount).toBe('Amount must be greater than zero');

    act(() => {
      result.current.updateFormData('amount', '100,00');
    });
    expect(result.current.errors.amount).toBe('');
  });

  it('formats currency values', () => {
    const { result } = renderHook(() => useTransactionForm());

    const formattedValue = result.current.formatValue('1234.56');
    expect(formattedValue).toMatch(/1\.234,56/);
  });

  it('submits the form successfully', async () => {
    const { result } = renderHook(() => useTransactionForm());
    const mockEvent = { preventDefault: vi.fn() } as unknown as FormEvent;

    act(() => {
      result.current.updateFormData('description', 'Teste');
      result.current.updateFormData('amount', 'R$ 100,00');
      result.current.updateFormData('category', {
        id: '1',
        name: 'Alimentação',
        icon: '🍽️',
        color: '#60A5FA',
      });
      result.current.updateFormData('date', '2024-01-01');
    });

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockAddTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Teste',
        amount: 100,
        type: 'EXPENSE',
        category: expect.objectContaining({ id: '1' }),
        date: '2024-01-01',
      }),
      'company-1',
    );
    expect(result.current.showSuccessTooltip).toBe(true);
  });

  it('handles submit errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockAddTransaction.mockImplementationOnce(() => {
      throw new Error('Erro ao salvar');
    });

    const { result } = renderHook(() => useTransactionForm());
    const mockEvent = { preventDefault: vi.fn() } as unknown as FormEvent;

    act(() => {
      result.current.updateFormData('description', 'Teste');
      result.current.updateFormData('amount', 'R$ 100,00');
      result.current.updateFormData('category', {
        id: '1',
        name: 'Alimentação',
        icon: '🍽️',
        color: '#60A5FA',
      });
      result.current.updateFormData('date', '2024-01-01');
    });

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.errors.submit).toBe('Erro ao salvar transação. Tente novamente.');
    expect(result.current.isSubmitting).toBe(false);
    consoleErrorSpy.mockRestore();
  });

  it('handles Ctrl+Enter shortcut', () => {
    const { result } = renderHook(() => useTransactionForm());
    const mockEvent = {
      key: 'Enter',
      ctrlKey: true,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
