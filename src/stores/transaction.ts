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
  { id: '1', name: 'Salário', type: 'INCOME', color: '#4CAF50' },
  { id: '2', name: 'Alimentação', type: 'EXPENSE', color: '#F44336' },
  { id: '3', name: 'Transporte', type: 'EXPENSE', color: '#2196F3' },
  { id: '4', name: 'Lazer', type: 'EXPENSE', color: '#9C27B0' },
  { id: '5', name: 'Investimentos', type: 'INCOME', color: '#FF9800' },
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
    set((state) => {
      const category = state.categories.find(c => c.id === transaction.categoryId);
      const account = state.accounts.find(a => a.id === transaction.accountId);

      if (!category || !account) {
        throw new Error('Category or account not found');
      }

      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: {
          id: category.id,
          name: category.name,
          type: category.type,
          color: category.color || '#000000'
        },
        account: {
          id: account.id,
          name: account.name
        },
        credit: transaction.type === 'INCOME' ? transaction.amount : 0,
        debit: transaction.type === 'EXPENSE' ? transaction.amount : 0,
        balance: 0 // Will be calculated by the dashboard
      };

      return {
        transactions: [...state.transactions, newTransaction],
      };
    }),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  updateTransaction: (id, transaction) =>
    set((state) => {
      const existingTransaction = state.transactions.find(t => t.id === id);
      if (!existingTransaction) {
        return state;
      }

      const category = state.categories.find(c => c.id === (transaction.categoryId || existingTransaction.categoryId));
      const account = state.accounts.find(a => a.id === (transaction.accountId || existingTransaction.accountId));

      if (!category || !account) {
        throw new Error('Category or account not found');
      }

      const updatedTransaction: Transaction = {
        ...existingTransaction,
        ...transaction,
        updatedAt: new Date().toISOString(),
        category: {
          id: category.id,
          name: category.name,
          type: category.type,
          color: category.color || '#000000'
        },
        account: {
          id: account.id,
          name: account.name
        },
        credit: transaction.type === 'INCOME' ? transaction.amount : existingTransaction.credit,
        debit: transaction.type === 'EXPENSE' ? transaction.amount : existingTransaction.debit
      };

      return {
        transactions: state.transactions.map((t) =>
          t.id === id ? updatedTransaction : t
        ),
      };
    }),
})); 