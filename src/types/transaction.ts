export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  transactions?: Transaction[];
  percentage?: number;
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
  total?: number;
  length?: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  accountId: string;
  note?: string;
  attachments?: string[];
  category: Category;
  account: Account;
  credit?: number;
  debit?: number;
  balance?: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'account' | 'credit' | 'debit' | 'balance'>;

export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}
