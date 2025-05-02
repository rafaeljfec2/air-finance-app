export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  note?: string;
  attachments?: string[];
  category: {
    id: string;
    name: string;
    type: TransactionType;
  };
  account: {
    id: string;
    name: string;
  };
  credit?: number;
  debit?: number;
  balance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
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
