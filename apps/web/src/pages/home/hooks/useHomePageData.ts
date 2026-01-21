import {
  useDashboardBalanceHistory,
  useDashboardSummary,
} from '@/hooks/useDashboard';
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

  // Calcular início e fim do mês atual
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
  // Buscar todas as transações do mês atual (sem filtro de conta)
  const transactionsQuery = useTransactions(companyId, monthFilters);
  const summaryQuery = useDashboardSummary(companyId, filters);

  const balance = summaryQuery.data?.balance ?? 0;
  const accumulatedBalance = summaryQuery.data?.accumulatedBalance ?? null;

  const income = summaryQuery.data?.income ?? 0;
  const expenses = summaryQuery.data?.expenses ?? 0;

  const total = income + expenses;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;

  // Criar mapa de accountId -> accountName
  const accountMap = useMemo(() => {
    const map = new Map<string, string>();
    accounts?.forEach((account) => {
      map.set(account.id, account.name);
    });
    return map;
  }, [accounts]);

  // Ordenar transações por data de lançamento DESC (mais recente primeiro) e adicionar nome da conta
  const transactionsWithAccount = useMemo(() => {
    const transactions = transactionsQuery.transactions ?? [];
    return transactions
      .map((tx): TransactionWithAccount => ({
        ...tx,
        accountName: accountMap.get(tx.accountId) ?? 'Conta não encontrada',
        accountId: tx.accountId, // Garantir que accountId está disponível
      }))
      .sort((a, b) => {
        // Ordenar por paymentDate DESC (mais recente primeiro)
        const dateA = new Date(a.paymentDate).getTime();
        const dateB = new Date(b.paymentDate).getTime();
        return dateB - dateA; // DESC: mais recente primeiro
      })
      .slice(0, 5); // Limitar a 5 transações
  }, [transactionsQuery.transactions, accountMap]);

  return {
    balance,
    accumulatedBalance,
    income,
    expenses,
    incomePercentage,
    expensesPercentage,
    total,
    isLoading:
      summaryQuery.isLoading ||
      balanceQuery.isLoading ||
      transactionsQuery.isLoading,
    transactions: transactionsWithAccount,
    summaryQuery,
  };
}
