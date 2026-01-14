import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useTransactionForm } from '../useTransactionForm';
import { useNavigate } from 'react-router-dom';

// Mock dos hooks externos
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockAddTransaction = jest.fn();

jest.mock('@/stores/statement', () => ({
  useStatementStore: () => ({
    addTransaction: mockAddTransaction,
  }),
}));

describe('useTransactionForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('deve inicializar com os valores padrão', () => {
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

  it('deve atualizar o valor do campo e marcar como tocado', () => {
    const { result } = renderHook(() => useTransactionForm());

    act(() => {
      result.current.updateFormData('description', 'Teste');
    });

    expect(result.current.formData.description).toBe('Teste');
    expect(result.current.errors.description).toBe('Description is required');
  });

  it('deve validar campos obrigatórios em tempo real', () => {
    const { result } = renderHook(() => useTransactionForm());

    // Campo vazio
    act(() => {
      result.current.updateFormData('description', '');
    });
    expect(result.current.errors.description).toBe('Description is required');

    // Campo preenchido
    act(() => {
      result.current.updateFormData('description', 'Teste');
    });
    expect(result.current.errors.description).toBeUndefined();

    // Valor inválido
    act(() => {
      result.current.updateFormData('amount', '0');
    });
    expect(result.current.errors.amount).toBe('Amount must be greater than zero');

    // Valor válido
    act(() => {
      result.current.updateFormData('amount', '100,00');
    });
    expect(result.current.errors.amount).toBeUndefined();
  });

  it('deve formatar o valor corretamente', () => {
    const { result } = renderHook(() => useTransactionForm());

    const formattedValue = result.current.formatValue('1234.56');
    expect(formattedValue).toBe('R$ 1.234,56');
  });

  it('deve submeter o formulário com sucesso', async () => {
    const { result } = renderHook(() => useTransactionForm());
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    // Preenche os campos obrigatórios
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

    // Submete o formulário
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockAddTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Teste',
        amount: 100,
        type: 'EXPENSE',
        category: expect.objectContaining({ id: '1' }),
        date: expect.any(Date),
      }),
    );
    expect(result.current.showSuccessTooltip).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/statement');
  });

  it('deve lidar com erros na submissão', async () => {
    const mockError = new Error('Erro ao salvar');
    mockAddTransaction.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useTransactionForm());
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    // Preenche os campos obrigatórios
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

    // Submete o formulário
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.errors.submit).toBe('Erro ao salvar transação. Tente novamente.');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('deve lidar com o atalho Ctrl+Enter', () => {
    const { result } = renderHook(() => useTransactionForm());
    const mockEvent = {
      key: 'Enter',
      ctrlKey: true,
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
