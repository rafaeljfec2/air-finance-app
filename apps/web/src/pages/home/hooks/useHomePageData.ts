import { useDashboardBalanceHistory, useDashboardSummary } from '@/hooks/useDashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCompanyStore } from '@/stores/company';
import { useMemo } from 'react';
import type { DashboardFilters } from '@/types/dashboard';
import type { Transaction } from '@/services/transactionService';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface TransactionWithAccount extends Transaction {
  accountName?: string;
}

export interface CashComposition {
  readonly recurringRevenue: number;
  readonly oneTimeRevenue: number;
  readonly fixedExpenses: number;
  readonly variableExpenses: number;
}

export interface CashInsight {
  readonly label: string;
  readonly tone: 'positive' | 'warning' | 'neutral';
}

function isRecurringTransaction(tx: Transaction): boolean {
  return tx.valueType === 'fixed' || tx.repeatMonthly;
}

function computeCashComposition(transactions: Transaction[]): CashComposition {
  let recurringRevenue = 0;
  let oneTimeRevenue = 0;
  let fixedExpenses = 0;
  let variableExpenses = 0;

  for (const tx of transactions) {
    const amount = Math.abs(tx.value);
    const recurring = isRecurringTransaction(tx);

    if (tx.launchType === 'revenue') {
      if (recurring) {
        recurringRevenue += amount;
      } else {
        oneTimeRevenue += amount;
      }
    } else if (tx.launchType === 'expense') {
      if (recurring) {
        fixedExpenses += amount;
      } else {
        variableExpenses += amount;
      }
    }
  }

  return { recurringRevenue, oneTimeRevenue, fixedExpenses, variableExpenses };
}

function deriveCashInsight(composition: CashComposition, balance: number): CashInsight {
  const { recurringRevenue, oneTimeRevenue, fixedExpenses } = composition;
  const totalRevenue = recurringRevenue + oneTimeRevenue;

  if (balance < 0) {
    return { label: 'Despesas superaram receitas neste período', tone: 'warning' };
  }

  if (totalRevenue === 0 && balance === 0) {
    return { label: 'Resultado do período baseado no fluxo de caixa', tone: 'neutral' };
  }

  if (oneTimeRevenue > recurringRevenue && totalRevenue > 0) {
    return { label: 'Saldo positivo, mas dependente de receitas pontuais', tone: 'warning' };
  }

  if (recurringRevenue >= fixedExpenses && recurringRevenue > 0) {
    return { label: 'Receitas recorrentes cobrem suas despesas fixas', tone: 'positive' };
  }

  return { label: 'Resultado do período baseado no fluxo de caixa', tone: 'neutral' };
}

export function useHomePageData() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { accounts } = useAccounts();

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: new Date().toISOString(),
    }),
    [],
  );

  const monthFilters = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    };
  }, []);

  const balanceQuery = useDashboardBalanceHistory(companyId, filters);
  const transactionsQuery = useTransactions(companyId, monthFilters);
  const summaryQuery = useDashboardSummary(companyId, filters);

  const balance = summaryQuery.data?.balance ?? 0;
  const accumulatedBalance = summaryQuery.data?.accumulatedBalance ?? null;

  const income = summaryQuery.data?.income ?? 0;
  const expenses = summaryQuery.data?.expenses ?? 0;

  const total = income + expenses;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;

  const expensesCoverageRatio = useMemo(() => {
    if (income === 0) return 0;
    return Math.round((expenses / income) * 100);
  }, [income, expenses]);

  const cashComposition = useMemo<CashComposition>(
    () => computeCashComposition(transactionsQuery.transactions ?? []),
    [transactionsQuery.transactions],
  );

  const cashInsight = useMemo<CashInsight>(
    () => deriveCashInsight(cashComposition, balance),
    [cashComposition, balance],
  );

  const accountMap = useMemo(() => {
    const map = new Map<string, string>();
    accounts?.forEach((account) => {
      map.set(account.id, account.name);
    });
    return map;
  }, [accounts]);

  const transactionsWithAccount = useMemo(() => {
    const transactions = transactionsQuery.transactions ?? [];
    return transactions
      .map(
        (tx): TransactionWithAccount => ({
          ...tx,
          accountName: accountMap.get(tx.accountId) ?? 'Conta não encontrada',
          accountId: tx.accountId,
        }),
      )
      .sort((a, b) => {
        const dateA = new Date(a.paymentDate).getTime();
        const dateB = new Date(b.paymentDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [transactionsQuery.transactions, accountMap]);

  return {
    balance,
    accumulatedBalance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    expensesCoverageRatio,
    total,
    cashComposition,
    cashInsight,
    isLoading: summaryQuery.isLoading || balanceQuery.isLoading || transactionsQuery.isLoading,
    transactions: transactionsWithAccount,
    summaryQuery,
  };
}
