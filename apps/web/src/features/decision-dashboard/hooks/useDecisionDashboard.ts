import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { useAccounts } from '@/hooks/useAccounts';
import {
  useDashboardExpensesByCategory,
  useDashboardRecentTransactions,
  useDashboardSummary,
} from '@/hooks/useDashboard';
import { useDecisionEngineEvaluateAuto } from '@/hooks/useDecisionEngineEvaluateAuto';
import { useIndebtedness } from '@/hooks/useIndebtedness';
import { budgetService } from '@/services/budgetService';
import { getTransactions } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import type { DashboardFilters } from '@/types/dashboard';

import { deriveBehaviorEvidence } from '../domain/deriveBehaviorEvidence';
import { resolveDecisionDashboard } from '../domain/resolveDecisionDashboard';
import { resolveFesStub } from '../domain/resolveFesStub';
import { deriveBriefingFacts } from '../mappers/deriveBriefingFacts';
import { deriveCreditPressure } from '../mappers/deriveCreditPressure';
import { mapApiToDecisionSignals } from '../mappers/mapApiToDecisionSignals';
import {
  mapDashboardPayloadToViewModel,
  type DecisionDashboardViewModel,
} from '../mappers/mapDashboardPayloadToViewModel';

import {
  resolveDashboardSurfaceState,
  type DashboardSurfaceState,
} from './resolveDashboardSurfaceState';

function currentBudgetFilters(): { year: string; month: string } {
  const now = new Date();
  return {
    year: format(now, 'yyyy'),
    month: format(now, 'MM'),
  };
}

function historyWindow(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 120);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export interface UseDecisionDashboardResult {
  readonly surfaceState: DashboardSurfaceState;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isAwaitingCompany: boolean;
  readonly viewModel: DecisionDashboardViewModel | null;
  readonly showSecondaryExpanded: boolean;
  readonly expandSecondary: () => void;
  readonly collapseSecondary: () => void;
}

export function useDecisionDashboard(): UseDecisionDashboardResult {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const fes = resolveFesStub();
  const [showSecondaryExpanded, setShowSecondaryExpanded] = useState(false);
  const { accounts, isLoading: accountsLoading } = useAccounts();

  const dashboardFilters: DashboardFilters = { timeRange: 'month' };
  const budgetFilters = currentBudgetFilters();

  const summaryQuery = useDashboardSummary(companyId, dashboardFilters);
  const expensesQuery = useDashboardExpensesByCategory(companyId, dashboardFilters);
  const recentTxQuery = useDashboardRecentTransactions(companyId, dashboardFilters, 20);
  const engineQuery = useDecisionEngineEvaluateAuto(companyId, { enabled: !!companyId });
  const indebtednessQuery = useIndebtedness(companyId);

  const budgetQuery = useQuery({
    queryKey: ['decision-dashboard', 'budget', companyId, budgetFilters.year, budgetFilters.month],
    queryFn: () => budgetService.getBudget(companyId, budgetFilters),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const historyRange = historyWindow();
  const historyQuery = useQuery({
    queryKey: [
      'decision-dashboard',
      'behavior-history',
      companyId,
      historyRange.startDate,
      historyRange.endDate,
    ],
    queryFn: () => getTransactions(companyId, historyRange),
    enabled: !!companyId,
    staleTime: 60_000,
  });

  const surfaceState = resolveDashboardSurfaceState({
    companyId,
    summaryLoading: summaryQuery.isLoading,
    budgetLoading: budgetQuery.isLoading || accountsLoading,
    recentTxLoading: recentTxQuery.isLoading,
    expensesLoading: expensesQuery.isLoading,
    indebtednessLoading: indebtednessQuery.isLoading,
    summaryError: summaryQuery.isError,
    budgetError: budgetQuery.isError,
    recentTxError: recentTxQuery.isError,
    hasSummaryData: summaryQuery.data !== undefined,
  });

  const viewModel = useMemo(() => {
    if (surfaceState !== 'ready' || !summaryQuery.data) {
      return null;
    }

    const hasOpenUnpaidBill =
      budgetQuery.data?.creditCards.some((card) =>
        card.bills.some((bill) => bill.status === 'OPEN'),
      ) ?? false;

    const hasCreditPressure = deriveCreditPressure({
      creditUtilizationStatus: indebtednessQuery.data?.creditUtilization.status,
      hasOpenUnpaidBill,
    });

    const topExpense = [...(expensesQuery.data ?? [])].sort((a, b) => b.value - a.value)[0];

    const briefingFacts = deriveBriefingFacts({
      accounts: accounts ?? [],
      receivables: budgetQuery.data?.receivables ?? [],
      creditCards: budgetQuery.data?.creditCards ?? [],
      cashFlow: budgetQuery.data?.cashFlow,
    });

    const behaviorEvidence = deriveBehaviorEvidence(
      (historyQuery.data ?? []).map((tx) => ({
        description: tx.description,
        amount: tx.value,
        date: tx.paymentDate,
        kind: tx.launchType === 'revenue' ? 'income' : 'expense',
      })),
    );

    const signals = mapApiToDecisionSignals({
      summary: {
        income: summaryQuery.data.income,
        expenses: summaryQuery.data.expenses,
        balance: summaryQuery.data.balance,
      },
      payablesCount: budgetQuery.data?.payables.length ?? 0,
      receivablesCount: budgetQuery.data?.receivables.length ?? 0,
      transactionsCount: recentTxQuery.data?.length ?? 0,
      hasCreditPressure,
      isFirstAccess: fes.isFirstAccess,
      readyForNext: fes.readyForNext,
      topExpenseLabel: topExpense?.name,
      briefingFacts,
      behaviorEvidence,
      engine: engineQuery.data
        ? {
            primary_issue: engineQuery.data.primary_issue,
            ordering_rationale: engineQuery.data.ordering_rationale,
            actions: engineQuery.data.actions,
          }
        : undefined,
    });

    const payload = resolveDecisionDashboard({
      archetype: fes.archetype,
      signals,
    });

    return mapDashboardPayloadToViewModel(payload);
  }, [
    surfaceState,
    summaryQuery.data,
    budgetQuery.data,
    recentTxQuery.data,
    expensesQuery.data,
    engineQuery.data,
    indebtednessQuery.data,
    historyQuery.data,
    accounts,
    fes.archetype,
    fes.isFirstAccess,
    fes.readyForNext,
  ]);

  return {
    surfaceState,
    isLoading: surfaceState === 'loading',
    isError: surfaceState === 'error',
    isAwaitingCompany: surfaceState === 'awaiting_company',
    viewModel,
    showSecondaryExpanded,
    expandSecondary: () => setShowSecondaryExpanded(true),
    collapseSecondary: () => setShowSecondaryExpanded(false),
  };
}
