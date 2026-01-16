import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { SortField, TransactionGridTransaction } from './TransactionGrid.types';

/**
 * Formats a date string preserving the date components (year, month, day)
 * without timezone conversion. This ensures that a date like "2025-12-02T00:00:00.000Z"
 * is displayed as 02/12/2025, not 01/12/2025 (which would happen with timezone conversion).
 *
 * Strategy: Extract date components directly from ISO string to avoid timezone issues.
 */
export const formatTransactionDate = (
  dateStr: string,
  formatStr: string = 'dd/MM/yyyy',
): string => {
  try {
    // Extract date components directly from ISO string (YYYY-MM-DD) to avoid timezone conversion
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(dateStr);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      // Create date using local timezone with the extracted components
      // This preserves the date as intended, without UTC conversion
      const date = new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        Number.parseInt(day, 10),
      );
      return format(date, formatStr, { locale: ptBR });
    }

    // Fallback to standard parsing if not ISO format
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return format(date, formatStr, { locale: ptBR });
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
      return formatTransactionDate(baseDate, 'dd/MM/yyyy');
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
    
    // Stable sort: If dates are equal, sort by creation time
    if (dateA === dateB) {
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return createdA - createdB;
    }
    
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
