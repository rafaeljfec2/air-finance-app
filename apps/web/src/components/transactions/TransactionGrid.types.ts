export type TransactionGridTransaction = {
  id: string;
  description: string;
  value: number;
  launchType: 'revenue' | 'expense';
  valueType: 'fixed' | 'variable';
  companyId: string;
  accountId: string;
  categoryId: string;
  paymentDate: string;
  issueDate: string;
  quantityInstallments: number;
  repeatMonthly: boolean;
  observation?: string;
  reconciled: boolean;
  createdAt: string;
  updatedAt: string;
  balance?: number;
  rawAccountId?: string;
};

export type SortField =
  | 'date'
  | 'category'
  | 'description'
  | 'account'
  | 'credit'
  | 'debit'
  | 'balance';
export type SortDirection = 'asc' | 'desc';

export type FilterValue = {
  field: SortField;
  values: Set<string>;
};

export interface TransactionGridProps {
  transactions: TransactionGridTransaction[];
  isLoading?: boolean;
  showActions?: boolean;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
  onViewHistory?: (transaction: TransactionGridTransaction) => void;
  className?: string;
  resetPageKey?: string | number; // Key that changes when page should be reset (e.g., account filter change)
}

export interface TransactionActionsProps {
  transaction: TransactionGridTransaction;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
  onViewHistory?: (transaction: TransactionGridTransaction) => void;
  variant?: 'table' | 'mobile';
}
