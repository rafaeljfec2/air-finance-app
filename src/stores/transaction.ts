import { create } from 'zustand';
import { Transaction, Category, Account, TransactionInput } from '@/types/transaction';

interface TransactionStore {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  addTransaction: (transaction: TransactionInput) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<TransactionInput>) => void;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Salário', type: 'INCOME' },
  { id: '2', name: 'Alimentação', type: 'EXPENSE' },
  { id: '3', name: 'Transporte', type: 'EXPENSE' },
  { id: '4', name: 'Lazer', type: 'EXPENSE' },
  { id: '5', name: 'Investimentos', type: 'INCOME' },
];

const initialAccounts: Account[] = [
  { id: '1', name: 'Conta Corrente' },
  { id: '2', name: 'Carteira' },
  { id: '3', name: 'Investimentos' },
];

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  categories: initialCategories,
  accounts: initialAccounts,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id
          ? {
              ...t,
              ...transaction,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),
})); 