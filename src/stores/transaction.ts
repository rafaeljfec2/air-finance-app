import { create } from 'zustand';
import { Transaction, Category, Account, TransactionInput } from '@/types/transaction';

interface TransactionStore {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  addTransaction: (transaction: TransactionInput, companyId: string) => void;
  removeTransaction: (id: string, companyId: string) => void;
  updateTransaction: (
    id: string,
    transaction: Partial<TransactionInput>,
    companyId: string,
  ) => void;
  getTransactionsByCompany: (companyId: string) => Transaction[];
}

const initialCategories: Category[] = [
  { id: '1', name: 'Salário', type: 'INCOME', color: '#4CAF50' },
  { id: '2', name: 'Alimentação', type: 'EXPENSE', color: '#F44336' },
  { id: '3', name: 'Transporte', type: 'EXPENSE', color: '#2196F3' },
  { id: '4', name: 'Lazer', type: 'EXPENSE', color: '#9C27B0' },
  { id: '5', name: 'Investimentos', type: 'INCOME', color: '#FF9800' },
];

const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta Corrente',
    balance: 0,
    createdAt: '',
    updatedAt: '',
    initialBalance: 0,
    initialBalanceDate: null,
  },
  {
    id: '2',
    name: 'Carteira',
    balance: 0,
    createdAt: '',
    updatedAt: '',
    initialBalance: 0,
    initialBalanceDate: null,
  },
  {
    id: '3',
    name: 'Investimentos',
    balance: 0,
    createdAt: '',
    updatedAt: '',
    initialBalance: 0,
    initialBalanceDate: null,
  },
];

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  categories: initialCategories,
  accounts: initialAccounts,
  addTransaction: (transaction, companyId: string) =>
    set((state) => {
      const category = state.categories.find((c) => c.id === transaction.categoryId);
      const account = state.accounts.find((a) => a.id === transaction.accountId);

      if (!category || !account) {
        throw new Error('Category or account not found');
      }

      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId,
        category: {
          id: category.id,
          name: category.name,
          type: category.type,
          color: category.color || '#000000',
        },
        account: {
          id: account.id,
          name: account.name,
          balance: account.balance,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          initialBalance: account.initialBalance,
          initialBalanceDate: account.initialBalanceDate,
        },
        credit: transaction.type === 'INCOME' ? transaction.amount : 0,
        debit: transaction.type === 'EXPENSE' ? transaction.amount : 0,
        balance: 0, // Will be calculated by the dashboard
      };

      return {
        transactions: [...state.transactions, newTransaction],
      };
    }),
  removeTransaction: (id, companyId) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id || t.companyId !== companyId),
    })),
  updateTransaction: (id, transaction, companyId) =>
    set((state) => {
      const existingTransaction = state.transactions.find(
        (t) => t.id === id && t.companyId === companyId,
      );
      if (!existingTransaction) {
        return state;
      }

      const category = state.categories.find(
        (c) => c.id === (transaction.categoryId || existingTransaction.categoryId),
      );
      const account = state.accounts.find(
        (a) => a.id === (transaction.accountId || existingTransaction.accountId),
      );

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
          color: category.color || '#000000',
        },
        account: {
          id: account.id,
          name: account.name,
          balance: account.balance,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          initialBalance: account.initialBalance,
          initialBalanceDate: account.initialBalanceDate,
        },
        credit: transaction.type === 'INCOME' ? transaction.amount : existingTransaction.credit,
        debit: transaction.type === 'EXPENSE' ? transaction.amount : existingTransaction.debit,
      };

      return {
        transactions: state.transactions.map((t) =>
          t.id === id && t.companyId === companyId ? updatedTransaction : t,
        ),
      };
    }),
  getTransactionsByCompany: (companyId) => {
    return get().transactions.filter((t) => t.companyId === companyId);
  },
}));
