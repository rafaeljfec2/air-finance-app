import { create } from 'zustand';
import { Transaction, Category } from '@/types/transaction';

// Mock data for development
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salário',
    type: 'INCOME',
    icon: 'money',
    color: '#34D399',
  },
  {
    id: '2',
    name: 'Moradia',
    type: 'EXPENSE',
    icon: 'home',
    color: '#F87171',
  },
  {
    id: '3',
    name: 'Alimentação',
    type: 'EXPENSE',
    icon: 'shopping-cart',
    color: '#60A5FA',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000,
    date: '2024-03-01T00:00:00.000Z',
    type: 'INCOME',
    category: mockCategories[0],
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z',
    categoryId: '',
    accountId: '',
    account: {
      id: '',
      name: ''
    }
  },
  {
    id: '2',
    description: 'Aluguel',
    amount: 1500,
    date: '2024-03-05T00:00:00.000Z',
    type: 'EXPENSE',
    category: mockCategories[1],
    note: 'Aluguel do mês de março',
    createdAt: '2024-03-05T00:00:00.000Z',
    updatedAt: '2024-03-05T00:00:00.000Z',
    categoryId: '',
    accountId: '',
    account: {
      id: '',
      name: ''
    }
  },
  {
    id: '3',
    description: 'Supermercado',
    amount: 800,
    date: '2024-03-10T00:00:00.000Z',
    type: 'EXPENSE',
    category: mockCategories[2],
    createdAt: '2024-03-10T00:00:00.000Z',
    updatedAt: '2024-03-10T00:00:00.000Z',
    categoryId: '',
    accountId: '',
    account: {
      id: '',
      name: ''
    }
  },
];

// Mock data do mês anterior para comparação
const mockPreviousTransactions: Transaction[] = [
  {
    id: '4',
    description: 'Salário',
    amount: 4800,
    date: '2024-02-01T00:00:00.000Z',
    type: 'INCOME',
    category: mockCategories[0],
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    categoryId: '',
    accountId: '',
    account: {
      id: '',
      name: ''
    }
  },
  {
    id: '5',
    description: 'Aluguel',
    amount: 1500,
    date: '2024-02-05T00:00:00.000Z',
    type: 'EXPENSE',
    category: mockCategories[1],
    createdAt: '2024-02-05T00:00:00.000Z',
    updatedAt: '2024-02-05T00:00:00.000Z',
    categoryId: '',
    accountId: '',
    account: {
      id: '',
      name: ''
    }
  },
];

interface ErrorDetails {
  message: string;
  name: string;
  stack?: string;
}

interface StatementState {
  transactions: Transaction[];
  categories: Category[];
  availableBalance: number;
  income: number;
  expenses: number;
  previousBalance: number;
  previousIncome: number;
  previousExpenses: number;
  isLoading: boolean;
  error: string | null;
  errorDetails: ErrorDetails | null;

  // Actions
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
}

export const useStatementStore = create<StatementState>((set, get) => ({
  transactions: [],
  categories: [],
  availableBalance: 0,
  income: 0,
  expenses: 0,
  previousBalance: 0,
  previousIncome: 0,
  previousExpenses: 0,
  isLoading: false,
  error: null,
  errorDetails: null,

  loadTransactions: async () => {
    try {
      set({ isLoading: true, error: null, errorDetails: null });

      // Simulando delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Usar dados mockados
      const transactions = mockTransactions;
      const categories = mockCategories;

      // Calcular totais do mês atual
      const income = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)  ;

      const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const availableBalance = income - expenses;

      // Usar dados mockados do mês anterior
      const previousTransactions = mockPreviousTransactions;

      // Calcular totais do mês anterior
      const previousIncome = previousTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const previousExpenses = previousTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const previousBalance = previousIncome - previousExpenses;

      set({
        transactions,
        categories,
        availableBalance,
        income,
        expenses,
        previousBalance,
        previousIncome,
        previousExpenses,
        isLoading: false,
      });
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      set({
        error: 'Erro ao carregar transações. Tente novamente.',
        errorDetails: {
          message: err instanceof Error ? err.message : 'Erro desconhecido',
          name: err instanceof Error ? err.name : 'UnknownError',
          stack: err instanceof Error ? err.stack : undefined
        },
        isLoading: false,
      });
    }
  },

  addTransaction: async transaction => {
    try {
      set({ isLoading: true, error: null, errorDetails: null });

      // Simulando delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      const now = new Date().toISOString();
      const newTransaction = {
        ...transaction,
        id: String(Date.now()),
        createdAt: now,
        updatedAt: now,
      };

      const { transactions } = get();
      const newTransactions = [...transactions, newTransaction];

      const income = newTransactions.reduce(
        (total, t) => (t.type === 'INCOME' ? total + t.amount : total),
        0
      );

      const expenses = newTransactions.reduce(
        (total, t) => (t.type === 'EXPENSE' ? total + t.amount : total),
        0
      );

      set({
        transactions: newTransactions,
        income,
        expenses,
        availableBalance: income - expenses,
        isLoading: false,
      });
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      set({
        error: 'Erro ao adicionar transação. Tente novamente.',
        errorDetails: {
          message: err instanceof Error ? err.message : 'Erro desconhecido',
          name: err instanceof Error ? err.name : 'UnknownError',
          stack: err instanceof Error ? err.stack : undefined
        },
        isLoading: false,
      });
    }
  },

  removeTransaction: async id => {
    try {
      set({ isLoading: true, error: null, errorDetails: null });

      // Simulando delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      const { transactions } = get();
      const updatedTransactions = transactions.filter(t => t.id !== id);

      // Recalcular totais
      const income = updatedTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = updatedTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const availableBalance = income - expenses;

      set({
        transactions: updatedTransactions,
        availableBalance,
        income,
        expenses,
        isLoading: false,
      });
    } catch (err) {
      console.error('Erro ao remover transação:', err);
      set({
        error: 'Erro ao remover transação. Tente novamente.',
        errorDetails: {
          message: err instanceof Error ? err.message : 'Erro desconhecido',
          name: err instanceof Error ? err.name : 'UnknownError',
          stack: err instanceof Error ? err.stack : undefined
        },
        isLoading: false,
      });
    }
  },

  updateTransaction: async (id, transaction) => {
    try {
      set({ isLoading: true, error: null, errorDetails: null });

      // Simulando delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      const { transactions } = get();
      const now = new Date().toISOString();
      const newTransactions = transactions.map(t =>
        t.id === id
          ? {
              ...t,
              ...transaction,
              updatedAt: now,
            }
          : t
      );

      const income = newTransactions.reduce(
        (total, t) => (t.type === 'INCOME' ? total + t.amount : total),
        0
      );

      const expenses = newTransactions.reduce(
        (total, t) => (t.type === 'EXPENSE' ? total + t.amount : total),
        0
      );

      set({
        transactions: newTransactions,
        income,
        expenses,
        availableBalance: income - expenses,
        isLoading: false,
      });
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      set({
        error: 'Erro ao atualizar transação. Tente novamente.',
        errorDetails: {
          message: err instanceof Error ? err.message : 'Erro desconhecido',
          name: err instanceof Error ? err.name : 'UnknownError',
          stack: err instanceof Error ? err.stack : undefined
        },
        isLoading: false,
      });
    }
  },
}));
