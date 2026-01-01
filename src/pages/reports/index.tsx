import { MonthNavigator } from '@/components/budget/MonthNavigator';
import { FinancialDashboard } from '@/components/reports/FinancialDashboard';
import { Insight } from '@/components/reports/InsightsCard';
import {
  useDashboardSummary,
  useDashboardBalanceHistory,
  useDashboardExpensesByCategory,
  useDashboardGoalsSummary,
} from '@/hooks/useDashboard';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import type { DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { parseApiError, getUserFriendlyMessage } from '@/utils/apiErrorHandler';
import { PieChart } from 'lucide-react';
import { useMemo, useState } from 'react';

export function Reports() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: currentDate.toISOString(),
    }),
    [currentDate],
  );

  // Use React Query hooks for real data
  const historyFilters: DashboardFilters = useMemo(
    () => ({
      timeRange: '6months', // Force 6 months for the chart
      referenceDate: currentDate.toISOString(),
    }),
    [currentDate],
  );

  // Use React Query hooks for real data
  const summaryQuery = useDashboardSummary(companyId, filters);
  const historyQuery = useDashboardBalanceHistory(companyId, historyFilters);
  const expensesQuery = useDashboardExpensesByCategory(companyId, filters);
  const goalsQuery = useDashboardGoalsSummary(companyId, 10); // Increase limit to show more goals

  const loading =
    summaryQuery.isLoading ||
    historyQuery.isLoading ||
    expensesQuery.isLoading ||
    goalsQuery.isLoading;

  // Get first error if any
  const error = summaryQuery.error ?? historyQuery.error ?? expensesQuery.error ?? goalsQuery.error;

  // Extract error message using apiErrorHandler
  const errorMessage = useMemo(() => {
    if (!error) return null;

    try {
      const apiError = parseApiError(error);
      return getUserFriendlyMessage(apiError);
    } catch {
      // Fallback if parsing fails
      return error instanceof Error ? error.message : 'Erro ao carregar dados';
    }
  }, [error]);

  // Get data with safe defaults
  const summary = summaryQuery.data ?? {
    income: 0,
    expenses: 0,
    balance: 0,
    previousIncome: null,
    previousExpenses: null,
    previousBalance: null,
    incomeChangePct: null,
    expensesChangePct: null,
    balanceChangePct: null,
    periodStart: currentDate.toISOString(),
    periodEnd: currentDate.toISOString(),
  };

  const historyRaw = historyQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];
  const goals = goalsQuery.data ?? [];

  // Transform history to match component interface (add revenue/expenses)
  const history = historyRaw.map((point) => ({
    date: point.date,
    balance: point.balance,
    revenue: point.income,
    expenses: point.expenses,
  }));

  // Build report structure from real data
  const reportStructure = useMemo(() => {
    const expensesTotal = summary.expenses;
    const expensesWithPct = expenses.map((e) => ({
      name: e.name,
      value: e.value,
      percentage: expensesTotal > 0 ? (e.value / expensesTotal) * 100 : 0,
      color: e.color,
    }));

    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      incomeByCategory: [],
      expensesByCategory: expensesWithPct,
      historicalIncome: [],
      historicalExpenses: [],
      income: {
        total: summary.income,
        categories: [],
      },
      expenses: {
        total: expensesTotal,
        categories: expensesWithPct.map((e) => ({
          name: e.name,
          value: e.value,
          percentage: e.percentage,
        })),
      },
      balance: {
        current: summary.balance,
        previous: summary.previousBalance ?? 0,
        variation: summary.balance - (summary.previousBalance ?? 0),
        percentageVariation: summary.balanceChangePct ?? 0,
      },
      summary: {
        income: { total: summary.income, categories: [] },
        expenses: { total: expensesTotal, categories: [] },
        balance: {
          current: summary.balance,
          previous: summary.previousBalance ?? 0,
          variation: 0,
          percentageVariation: 0,
        },
      },
    };
  }, [summary, expenses, currentDate]);

  const expensesTotal = summary.expenses;

  // Generate Insights based on the real data
  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];

    // 1. Balance Check
    if (summary.balance < 0) {
      list.push({
        id: 'negative-balance',
        type: 'negative',
        title: 'Balanço Negativo',
        description: `Suas despesas superaram as receitas em ${formatCurrency(Math.abs(summary.balance))} este mês.`,
      });
    } else if (summary.balance > 0) {
      list.push({
        id: 'positive-balance',
        type: 'positive',
        title: 'No Azul',
        description: `Parabéns! Você economizou ${formatCurrency(summary.balance)} este mês.`,
      });
    }

    // 2. High Expense Alert (Pareto top category)
    if (expenses.length > 0) {
      const sortedCats = [...expenses].sort((a, b) => b.value - a.value);
      const top = sortedCats[0];
      const percentage = expensesTotal > 0 ? (top.value / expensesTotal) * 100 : 0;

      if (top && percentage > 30) {
        list.push({
          id: 'high-expense-cat',
          type: 'warning',
          title: `Atenção com ${top.name}`,
          description: `Esta categoria representa ${percentage.toFixed(0)}% das suas despesas totais.`,
        });
      }
    }

    // 3. Trend Check (vs Last Month) - simplified using balance history
    // Note: balance-history endpoint doesn't provide expenses breakdown
    // Trend analysis would require additional data from summary or expenses endpoints

    return list;
  }, [summary, expenses, history, expensesTotal]);

  // Removed previousMonth and nextMonth helpers as they are handled by MonthNavigator now

  // Check companyId first
  if (!companyId) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <p className="text-muted-foreground">
            Selecione uma empresa para visualizar os relatórios.
          </p>
        </div>
      </ViewDefault>
    );
  }

  // Then check loading
  if (loading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <p className="text-muted-foreground">Carregando dados do relatório...</p>
        </div>
      </ViewDefault>
    );
  }

  // Finally check errors
  if (errorMessage) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <p className="text-red-500">Erro ao carregar dados: {errorMessage}</p>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="space-y-6 px-4 sm:px-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Painel Financeiro
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visão estratégica para tomada de decisão
              </p>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex justify-center sm:justify-end">
            <MonthNavigator
              month={(currentDate.getMonth() + 1).toString().padStart(2, '0')}
              year={currentDate.getFullYear().toString()}
              onChange={(m: string, y: string) => {
                const newDate = new Date(Number(y), Number(m) - 1, 1);
                setCurrentDate(newDate);
              }}
            />
          </div>
        </div>

        {/* Dashboard with Real Data */}
        <FinancialDashboard
          report={reportStructure}
          historicalData={history}
          insights={insights}
          goals={goals}
        />
      </div>
    </ViewDefault>
  );
}
