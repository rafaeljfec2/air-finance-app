import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import type { SortField, TransactionGridTransaction } from './TransactionGrid.types';

export const formatTransactionDate = (
  dateStr: string,
  formatStr: string = 'dd/MM/yyyy HH:mm',
): string => {
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

export const getFieldValue = (
  transaction: TransactionGridTransaction,
  field: SortField,
): string | number => {
  switch (field) {
    case 'date': {
      const baseDate = transaction.paymentDate || transaction.createdAt;
      return formatTransactionDate(baseDate, 'dd/MM HH:mm');
    }
    case 'category':
      return transaction.categoryId || 'Sem categoria';
    case 'description':
      return transaction.description || 'Sem descrição';
    case 'account':
      return transaction.accountId || 'Sem conta';
    case 'credit':
      return transaction.launchType === 'revenue' ? transaction.value : 0;
    case 'debit':
      return transaction.launchType === 'expense' ? transaction.value : 0;
    case 'balance':
      return transaction.balance ?? 0;
    default:
      return '';
  }
};

export const getFieldValues = (
  transactions: TransactionGridTransaction[],
  field: SortField,
): string[] => {
  return transactions.map((transaction) => {
    const rawValue = getFieldValue(transaction, field);

    if (typeof rawValue === 'number') {
      // Para valores numéricos (crédito, débito, saldo),
      // usamos o valor absoluto para exibição e formatamos como moeda.
      return formatCurrency(Math.abs(rawValue));
    }

    return rawValue.toString();
  });
};

export const createPreviousBalanceRow = (
  previousBalance: number,
  startDate: string,
): TransactionGridTransaction => {
  const start = new Date(startDate);
  start.setDate(start.getDate() - 1); // Data anterior

  return {
    id: 'previous-balance',
    description: 'SALDO ANTERIOR',
    value: 0,
    launchType: 'revenue',
    valueType: 'fixed',
    companyId: '',
    accountId: 'Todas',
    categoryId: 'Saldo Anterior',
    paymentDate: start.toISOString(),
    issueDate: start.toISOString(),
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: true,
    createdAt: start.toISOString(),
    updatedAt: start.toISOString(),
    balance: previousBalance,
  };
};

export const calculateBalance = (
  transactions: TransactionGridTransaction[],
): TransactionGridTransaction[] => {
  const sortedByDateAsc = [...transactions].sort((a, b) => {
    const dateA = new Date(a.paymentDate || a.createdAt).getTime();
    const dateB = new Date(b.paymentDate || b.createdAt).getTime();
    return dateA - dateB;
  });

  // Find if there's a previous balance row and use its balance as starting point
  const previousBalanceRow = sortedByDateAsc.find((tx) => tx.id === 'previous-balance');
  let accumulatedBalance = previousBalanceRow?.balance ?? 0;

  return sortedByDateAsc.map((transaction) => {
    // If this is the previous balance row, keep its balance as is
    if (transaction.id === 'previous-balance') {
      return transaction;
    }

    // Backend already normalizes values:
    // - Revenue: positive value
    // - Expense: negative value
    // So we can simply add the value directly to the balance
    accumulatedBalance += transaction.value;

    return {
      ...transaction,
      balance: accumulatedBalance,
    };
  });
};
