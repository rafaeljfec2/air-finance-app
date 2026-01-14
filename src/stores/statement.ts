import { create } from 'zustand';
import { Transaction, Category, TransactionType } from '@/types/transaction';

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
  errorDetails: unknown;
  loadTransactions: () => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

// Mock data for testing
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    type: 'INCOME' as TransactionType,
    color: '#10B981',
    icon: '💼',
  },
  {
    id: '2',
    name: 'Freelance',
    type: 'INCOME' as TransactionType,
    color: '#3B82F6',
    icon: '💻',
  },
  {
    id: '3',
    name: 'Investments',
    type: 'INCOME' as TransactionType,
    color: '#8B5CF6',
    icon: '📈',
  },
  {
    id: '4',
    name: 'Housing',
    type: 'EXPENSE' as TransactionType,
    color: '#EF4444',
    icon: '🏠',
  },
  {
    id: '5',
    name: 'Food',
    type: 'EXPENSE' as TransactionType,
    color: '#F59E0B',
    icon: '🍽️',
  },
  {
    id: '6',
    name: 'Transport',
    type: 'EXPENSE' as TransactionType,
    color: '#6366F1',
    icon: '🚗',
  },
  {
    id: '7',
    name: 'Leisure',
    type: 'EXPENSE' as TransactionType,
    color: '#EC4899',
    icon: '🎮',
  },
];

const now = new Date().toISOString();

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Monthly Salary',
    amount: 5000,
    type: 'INCOME' as TransactionType,
    category: {
      id: mockCategories[0].id,
      name: mockCategories[0].name,
      type: mockCategories[0].type,
      color: mockCategories[0].color || '#10B981',
    },
    date: now,
    categoryId: mockCategories[0].id,
    accountId: '1',
    note: 'Regular salary payment',
    account: {
      id: '1',
      name: 'Main Account',
      balance: 0,
      createdAt: '',
      updatedAt: '',
      initialBalance: 0,
      initialBalanceDate: null,
    },
    createdAt: now,
    updatedAt: now,
    companyId: '',
  },
  {
    id: '2',
    description: 'Freelance Project',
    amount: 1500,
    type: 'INCOME' as TransactionType,
    category: {
      id: mockCategories[1].id,
      name: mockCategories[1].name,
      type: mockCategories[1].type,
      color: mockCategories[1].color || '#3B82F6',
    },
    date: now,
    categoryId: mockCategories[1].id,
    accountId: '1',
    note: 'Web development project',
    account: {
      id: '1',
      name: 'Main Account',
      balance: 0,
      createdAt: '',
      updatedAt: '',
      initialBalance: 0,
      initialBalanceDate: null,
    },
    createdAt: now,
    updatedAt: now,
    companyId: '',
  },
  {
    id: '3',
    description: 'Rent Payment',
    amount: 1200,
    type: 'EXPENSE' as TransactionType,
    category: {
      id: mockCategories[3].id,
      name: mockCategories[3].name,
      type: mockCategories[3].type,
      color: mockCategories[3].color || '#EF4444',
    },
    date: now,
    categoryId: mockCategories[3].id,
    accountId: '1',
    note: 'Monthly rent',
    account: {
      id: '1',
      name: 'Main Account',
      balance: 0,
      createdAt: '',
      updatedAt: '',
      initialBalance: 0,
      initialBalanceDate: null,
    },
    createdAt: now,
    updatedAt: now,
    companyId: '',
  },
  {
    id: '4',
    description: 'Groceries',
    amount: 300,
    type: 'EXPENSE' as TransactionType,
    category: {
      id: mockCategories[4].id,
      name: mockCategories[4].name,
      type: mockCategories[4].type,
      color: mockCategories[4].color || '#F59E0B',
    },
    date: now,
    categoryId: mockCategories[4].id,
    accountId: '1',
    note: 'Weekly groceries',
    account: {
      id: '1',
      name: 'Main Account',
      balance: 0,
      createdAt: '',
      updatedAt: '',
      initialBalance: 0,
      initialBalanceDate: null,
    },
    createdAt: now,
    updatedAt: now,
    companyId: '',
  },
];

export const useStatementStore = create<StatementState>((set) => ({
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

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calculate totals
      const income = mockTransactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = mockTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const availableBalance = income - expenses;

      set({
        transactions: mockTransactions,
        categories: mockCategories,
        income,
        expenses,
        availableBalance,
        previousBalance: 4000, // Mock previous month data
        previousIncome: 4500,
        previousExpenses: 1000,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to load transactions',
        errorDetails: error,
        isLoading: false,
      });
    }
  },

  removeTransaction: async (id: string) => {
    try {
      set({ isLoading: true, error: null, errorDetails: null });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: 'Failed to remove transaction',
        errorDetails: error,
        isLoading: false,
      });
    }
  },
}));
