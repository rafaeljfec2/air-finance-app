import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { useTransactionStore } from '@/stores/transaction';

import { NewTransaction } from '../transactions/new';

// Mock the transaction store
jest.mock('@/stores/transaction', () => ({
  useTransactionStore: jest.fn(),
}));

describe('NewTransaction', () => {
  const mockAddTransaction = jest.fn();
  const mockCategories = [
    {
      id: 'cat1',
      name: 'Food',
      type: 'EXPENSE',
      color: '#F44336',
      icon: '🍽️',
    },
    {
      id: 'cat2',
      name: 'Salary',
      type: 'INCOME',
      color: '#4CAF50',
      icon: '💰',
    },
  ];
  const mockAccounts = [
    {
      id: 'acc1',
      name: 'Main Account',
    },
  ];

  beforeEach(() => {
    (useTransactionStore as unknown as jest.Mock).mockReturnValue({
      addTransaction: mockAddTransaction,
      categories: mockCategories,
      accounts: mockAccounts,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form correctly', () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>,
    );

    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    expect(screen.getByText('Despesa')).toBeInTheDocument();
    expect(screen.getByText('Receita')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Conta')).toBeInTheDocument();
    expect(screen.getByLabelText('Data')).toBeInTheDocument();
    expect(screen.getByLabelText('Observação')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>,
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test Transaction' },
    });
    fireEvent.change(screen.getByLabelText('Valor'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: 'cat1' },
    });
    fireEvent.change(screen.getByLabelText('Conta'), {
      target: { value: 'acc1' },
    });
    fireEvent.change(screen.getByLabelText('Data'), {
      target: { value: '2024-03-20' },
    });
    fireEvent.change(screen.getByLabelText('Observação'), {
      target: { value: 'Test note' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Salvar Transação'));

    expect(mockAddTransaction).toHaveBeenCalledWith({
      type: 'EXPENSE',
      description: 'Test Transaction',
      amount: 100,
      categoryId: 'cat1',
      accountId: 'acc1',
      date: '2024-03-20',
      note: 'Test note',
    });
  });

  it('should switch between expense and income types', () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>,
    );

    // Initially should show expense categories
    const categorySelect = screen.getByLabelText('Categoria');
    expect(categorySelect).toHaveTextContent('Food');
    expect(categorySelect).not.toHaveTextContent('Salary');

    // Switch to income
    fireEvent.click(screen.getByText('Receita'));

    // Should now show income categories
    expect(categorySelect).toHaveTextContent('Salary');
    expect(categorySelect).not.toHaveTextContent('Food');
  });

  it('should validate required fields', async () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>,
    );

    // Submit without filling required fields
    fireEvent.click(screen.getByText('Salvar Transação'));

    // Check for HTML5 validation messages
    await waitFor(() => {
      expect(screen.getByLabelText('Descrição')).toBeInvalid();
      expect(screen.getByLabelText('Valor')).toBeInvalid();
      expect(screen.getByLabelText('Categoria')).toBeInvalid();
      expect(screen.getByLabelText('Conta')).toBeInvalid();
      expect(screen.getByLabelText('Data')).toBeInvalid();
    });

    expect(mockAddTransaction).not.toHaveBeenCalled();
  });
});
