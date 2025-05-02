import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  { id: '1', nome: 'Salário', tipo: 'RECEITA' },
  { id: '2', nome: 'Alimentação', tipo: 'DESPESA' },
  { id: '3', nome: 'Transporte', tipo: 'DESPESA' },
  { id: '4', nome: 'Lazer', tipo: 'DESPESA' },
  { id: '5', nome: 'Investimentos', tipo: 'RECEITA' },
];

const initialAccounts: Account[] = [
  { id: '1', nome: 'Conta Corrente' },
  { id: '2', nome: 'Carteira' },
  { id: '3', nome: 'Investimentos' },
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