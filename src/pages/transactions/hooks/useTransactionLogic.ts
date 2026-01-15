import { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import {
  calculateBalance,
  createPreviousBalanceRow,
} from '@/components/transactions/TransactionGrid.utils';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { usePreviousBalance, useTransactions } from '@/hooks/useTransactions';
import { useCallback, useMemo } from 'react';

interface UseTransactionLogicProps {
  companyId: string;
  startDate: string;
  endDate: string;
  selectedAccountId: string | undefined;
  searchTerm: string;
  selectedType: string;
}

export function useTransactionLogic({
  companyId,
  startDate,
  endDate,
  selectedAccountId,
  searchTerm,
  selectedType,
}: UseTransactionLogicProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategories(companyId);

  const {
    transactions = [],
    isLoading,
    isFetching,
    deleteTransaction,
  } = useTransactions(companyId, { startDate, endDate, accountId: selectedAccountId });

  const { previousBalance = 0 } = usePreviousBalance(companyId, startDate, selectedAccountId);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const accountMap = useMemo(() => {
    const map = new Map<string, string>();
    accounts?.forEach((a) => map.set(a.id, a.name));
    return map;
  }, [accounts]);

  type TransactionWithRawAccount = TransactionGridTransaction & { rawAccountId: string };

  const transactionsWithLabels = useMemo(
    () =>
      [...transactions].map(
        (tx): TransactionWithRawAccount => ({
          ...tx,
          rawAccountId: tx.accountId,
          categoryId: categoryMap.get(tx.categoryId) ?? tx.categoryId,
          accountId: accountMap.get(tx.accountId) ?? tx.accountId,
        }),
      ),
    [transactions, categoryMap, accountMap],
  );

  const matchesSearchTerm = (description: string, search: string): boolean => {
    return description.toLowerCase().includes(search.toLowerCase());
  };

  const matchesTransactionType = (type: string, launchType: string): boolean => {
    if (type === 'all') {
      return true;
    }
    if (type === 'RECEITA' && launchType === 'revenue') {
      return true;
    }
    if (type === 'DESPESA' && launchType === 'expense') {
      return true;
    }
    return false;
  };

  const matchesDatePeriod = (
    paymentDate: string,
    start: string | null,
    end: string | null,
  ): boolean => {
    if (!start && !end) {
      return true;
    }

    const transactionDate = new Date(paymentDate);

    const txDateUTC = new Date(
      Date.UTC(
        transactionDate.getUTCFullYear(),
        transactionDate.getUTCMonth(),
        transactionDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    if (start) {
      const [year, month, day] = start.split('-').map(Number);
      const startDateUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      if (txDateUTC < startDateUTC) {
        return false;
      }
    }

    if (end) {
      const [year, month, day] = end.split('-').map(Number);
      const endDateUTC = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      if (txDateUTC > endDateUTC) {
        return false;
      }
    }

    return true;
  };

  const shouldIncludeTransaction = useCallback((transaction: TransactionGridTransaction): boolean => {
    if (transaction.id === 'previous-balance') {
      return true;
    }

    const matchesSearch = matchesSearchTerm(transaction.description, searchTerm);
    const matchesType = matchesTransactionType(selectedType, transaction.launchType);
    const matchesPeriod = matchesDatePeriod(transaction.paymentDate, startDate, endDate);

    return matchesSearch && matchesType && matchesPeriod;
  }, [searchTerm, selectedType, startDate, endDate]);

  const transactionsWithPreviousBalance = useMemo(() => {
    let transactionsList = [...transactionsWithLabels];

    if (startDate) {
      const previousBalanceRow = createPreviousBalanceRow(previousBalance, startDate);
      const previousBalanceWithRaw = {
        ...previousBalanceRow,
        rawAccountId: 'previous-balance',
        categoryId: 'Saldo Anterior',
        accountId: selectedAccountId ? (accountMap.get(selectedAccountId) ?? 'Todas') : 'Todas',
      };
      transactionsList = [previousBalanceWithRaw as TransactionWithRawAccount, ...transactionsList];
    }

    return calculateBalance(transactionsList);
  }, [transactionsWithLabels, previousBalance, startDate, selectedAccountId, accountMap]);

  const filteredTransactions = useMemo(() => {
    return [...transactionsWithPreviousBalance]
      .sort((a, b) => {
        const dateA = new Date(a.paymentDate || a.createdAt).getTime();
        const dateB = new Date(b.paymentDate || b.createdAt).getTime();

        if (dateA === dateB) {
          const createdA = new Date(a.createdAt).getTime();
          const createdB = new Date(b.createdAt).getTime();
          return createdB - createdA; // Newest created first (DESC)
        }

        return dateB - dateA; // Newest date first (DESC)
      })
      .filter(shouldIncludeTransaction);
  }, [transactionsWithPreviousBalance, shouldIncludeTransaction]);

  const totals = useMemo(() => {
    let totalCredits = 0;
    let totalDebits = 0;

    const liquidAccountIds = new Set(
      accounts?.filter((a) => ['checking', 'digital_wallet'].includes(a.type)).map((a) => a.id),
    );

    filteredTransactions.forEach((transaction) => {
      if (transaction.id === 'previous-balance') {
        return;
      }

      if (!selectedAccountId) {
        const rawId = (transaction as TransactionGridTransaction & { rawAccountId?: string })
          .rawAccountId;
        if (rawId && !liquidAccountIds.has(rawId)) {
          return;
        }
      }

      if (transaction.launchType === 'revenue') {
        totalCredits += Math.abs(transaction.value);
      } else if (transaction.launchType === 'expense') {
        totalDebits += Math.abs(transaction.value);
      }
    });

    const netPeriodBalance = totalCredits - totalDebits;

    return { totalCredits, totalDebits, finalBalance: netPeriodBalance };
  }, [filteredTransactions, accounts, selectedAccountId]);

  return {
    transactions: filteredTransactions,
    totals,
    isLoading,
    isFetching,
    accounts,
    categories,
    deleteTransaction,
  };
}
