import { useMemo } from 'react';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid';
import {
  calculateBalance,
  createPreviousBalanceRow,
} from '@/components/transactions/TransactionGrid.utils';
import type { Account } from '@/services/accountService';
import type { ExtractResponse } from '@/services/transactionService';

import { getLedgerBalanceForPeriod } from '../utils/getLedgerBalanceForPeriod';
import {
  transformExtractTransactions,
  type ExtractGridTransaction,
} from '../utils/transformExtractTransactions';

interface UseImportOfxTransactionsParams {
  readonly companyId: string;
  readonly extracts: ExtractResponse[];
  readonly accounts: Account[] | undefined;
  readonly categories: { id: string; name: string }[] | undefined;
  readonly startDate: string;
  readonly endDate: string;
  readonly selectedAccountId: string | undefined;
  readonly previousBalance: number;
  readonly searchTerm: string;
}

interface ImportOfxTotals {
  readonly totalCredits: number;
  readonly totalDebits: number;
  readonly finalBalance: number;
  readonly ledgerBalanceDate: string | null;
}

export function useImportOfxTransactions({
  companyId,
  extracts,
  accounts,
  categories,
  startDate,
  endDate,
  selectedAccountId,
  previousBalance,
  searchTerm,
}: UseImportOfxTransactionsParams) {
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categories]);

  const rawTransactions: ExtractGridTransaction[] = useMemo(
    () => transformExtractTransactions(extracts, accounts, categoryMap, companyId),
    [companyId, extracts, accounts, categoryMap],
  );

  const ledgerBalanceData = useMemo(() => {
    if (!endDate || extracts.length === 0) {
      return null;
    }
    return getLedgerBalanceForPeriod({
      extracts,
      endDate,
      accountId: selectedAccountId,
    });
  }, [extracts, endDate, selectedAccountId]);

  const filteredTransactions = useMemo(() => {
    let filtered: TransactionGridTransaction[] = rawTransactions;

    if (startDate || endDate) {
      filtered = filtered.filter((tx) => {
        if (!tx.paymentDate) return true;
        try {
          const txDate = tx.paymentDate.split('T')[0];
          if (startDate && txDate < startDate) return false;
          if (endDate && txDate > endDate) return false;
          return true;
        } catch {
          return true;
        }
      });
    }

    if (selectedAccountId && selectedAccountId !== 'all') {
      filtered = filtered.filter((tx) => {
        const txWithKey = tx as ExtractGridTransaction;
        return txWithKey.accountKey === selectedAccountId;
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate).getTime();
      const dateB = new Date(b.paymentDate).getTime();
      if (dateA === dateB) {
        return a.id > b.id ? 1 : -1;
      }
      return dateA - dateB;
    });

    let transactionsWithBalance = calculateBalance(filtered);

    if (startDate) {
      const previousBalanceRow = createPreviousBalanceRow(previousBalance, startDate);
      if (selectedAccountId && selectedAccountId !== 'all') {
        const matchedAccount = accounts?.find((acc) => acc.accountNumber === selectedAccountId);
        previousBalanceRow.accountId = matchedAccount?.name || selectedAccountId || 'Todas';
      } else {
        previousBalanceRow.accountId = 'Todas';
      }
      transactionsWithBalance = [previousBalanceRow, ...transactionsWithBalance];
      transactionsWithBalance = calculateBalance(transactionsWithBalance);
    }

    if (ledgerBalanceData && transactionsWithBalance.length > 0) {
      const lastTransaction = transactionsWithBalance[transactionsWithBalance.length - 1];
      const calculatedBalance = lastTransaction.balance ?? 0;
      const officialBalance = ledgerBalanceData.balance;
      const difference = officialBalance - calculatedBalance;

      transactionsWithBalance = transactionsWithBalance.map((tx) => {
        if (tx.id === 'previous-balance') {
          return tx;
        }
        return {
          ...tx,
          balance: (tx.balance ?? 0) + difference,
        };
      });
    }

    return transactionsWithBalance;
  }, [
    rawTransactions,
    startDate,
    endDate,
    selectedAccountId,
    previousBalance,
    accounts,
    ledgerBalanceData,
  ]);

  const searchingTransactions = useMemo(() => {
    if (!searchTerm.trim()) return filteredTransactions;
    const term = searchTerm.toLowerCase();
    return filteredTransactions.filter((tx) => {
      if (tx.id === 'previous-balance') return true;
      const desc = (tx.description ?? '').toLowerCase();
      const account = (tx.accountId ?? '').toLowerCase();
      const amount = tx.value.toString().toLowerCase();
      return desc.includes(term) || account.includes(term) || amount.includes(term);
    });
  }, [filteredTransactions, searchTerm]);

  const totals: ImportOfxTotals = useMemo(() => {
    let totalCredits = 0;
    let totalDebits = 0;

    let finalBalance: number;
    if (ledgerBalanceData) {
      finalBalance = ledgerBalanceData.balance;
    } else if (filteredTransactions.length > 0) {
      finalBalance = filteredTransactions[filteredTransactions.length - 1].balance ?? 0;
    } else {
      finalBalance = previousBalance;
    }

    filteredTransactions.forEach((transaction) => {
      if (transaction.id === 'previous-balance') {
        return;
      }

      if (transaction.launchType === 'revenue') {
        totalCredits += Math.abs(transaction.value);
      } else if (transaction.launchType === 'expense') {
        totalDebits += Math.abs(transaction.value);
      }
    });

    return {
      totalCredits,
      totalDebits,
      finalBalance,
      ledgerBalanceDate: ledgerBalanceData?.date ?? null,
    };
  }, [filteredTransactions, previousBalance, ledgerBalanceData]);

  return {
    transactions: searchingTransactions,
    totals,
  };
}
