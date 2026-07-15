import type {
  DecisionBriefingFactsSignal,
  DecisionDashboardSignals,
} from '@/types/decisionDashboard';

export interface DecisionDashboardApiSnapshot {
  readonly summary: {
    readonly income: number;
    readonly expenses: number;
    readonly balance: number;
  };
  readonly payablesCount: number;
  readonly receivablesCount: number;
  readonly transactionsCount: number;
  readonly hasCreditPressure: boolean;
  readonly isFirstAccess: boolean;
  readonly readyForNext: boolean;
  readonly topExpenseLabel?: string;
  readonly briefingFacts?: DecisionBriefingFactsSignal;
  readonly engine?: {
    readonly primary_issue?: string;
    readonly ordering_rationale?: string;
    readonly actions?: ReadonlyArray<{
      readonly title: string;
      readonly description: string;
    }>;
  };
}

export function mapApiToDecisionSignals(
  snapshot: DecisionDashboardApiSnapshot,
): DecisionDashboardSignals {
  const primaryAction = snapshot.engine?.actions?.[0];

  return {
    hasAnyTransactions: snapshot.transactionsCount > 0,
    hasPayables: snapshot.payablesCount > 0,
    hasReceivables: snapshot.receivablesCount > 0,
    hasCreditPressure: snapshot.hasCreditPressure,
    income: snapshot.summary.income,
    expenses: snapshot.summary.expenses,
    balance: snapshot.summary.balance,
    isFirstAccess: snapshot.isFirstAccess,
    enginePrimaryIssue: snapshot.engine?.primary_issue,
    engineActionTitle: primaryAction?.title,
    engineActionDescription: primaryAction?.description,
    engineOrderingRationale: snapshot.engine?.ordering_rationale,
    topExpenseLabel: snapshot.topExpenseLabel,
    readyForNext: snapshot.readyForNext,
    briefingFacts: snapshot.briefingFacts,
  };
}
