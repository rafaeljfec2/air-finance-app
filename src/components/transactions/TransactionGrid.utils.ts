import { format } from 'date-fns';
import type { TransactionGridTransaction, SortField } from './TransactionGrid.types';
import { formatCurrency } from '@/utils/formatters';

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

export const calculateBalance = (
  transactions: TransactionGridTransaction[],
): TransactionGridTransaction[] => {
  const sortedByDateAsc = [...transactions].sort((a, b) => {
    const dateA = new Date(a.paymentDate || a.createdAt).getTime();
    const dateB = new Date(b.paymentDate || b.createdAt).getTime();
    return dateA - dateB;
  });

  let accumulatedBalance = 0;
  return sortedByDateAsc.map((transaction) => {
    const credit = transaction.launchType === 'revenue' ? transaction.value : 0;
    const debit = transaction.launchType === 'expense' ? transaction.value : 0;
    accumulatedBalance += credit - debit;
    return {
      ...transaction,
      balance: accumulatedBalance,
    };
  });
};
