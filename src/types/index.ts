import { Account, Category, Transaction, TransactionType } from './transaction';
import { User } from './user';

export interface Dashboard {
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
}

export interface MonthlyReport {
  summary: {
    income: {
      total: number;
      categories: Array<{
        name: string;
        value: number;
      }>;
    };
    expenses: {
      total: number;
      categories: Array<{
        name: string;
        value: number;
      }>;
    };
    balance: {
      current: number;
      previous: number;
      variation: number;
    };
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
}

export type { Account, Category, Transaction, TransactionType };

export * from './company';
