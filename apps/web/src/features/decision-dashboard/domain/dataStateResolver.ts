import type { DashboardDataState, DecisionDashboardSignals } from '@/types/decisionDashboard';

function hasCommitmentSignal(signals: DecisionDashboardSignals): boolean {
  return signals.hasPayables || signals.hasReceivables || signals.hasCreditPressure;
}

function hasMovementSignal(signals: DecisionDashboardSignals): boolean {
  return signals.hasAnyTransactions || signals.income > 0 || signals.expenses > 0;
}

export function resolveDataState(signals: DecisionDashboardSignals): DashboardDataState {
  if (signals.isFirstAccess) {
    return 'first_access';
  }

  const hasCommitments = hasCommitmentSignal(signals);
  const hasMovement = hasMovementSignal(signals);

  if (!hasCommitments && !hasMovement) {
    return 'no_data';
  }

  const isSufficient =
    hasMovement && hasCommitments && (signals.income > 0 || signals.expenses > 0);

  if (isSufficient && signals.readyForNext) {
    return 'advanced';
  }

  if (isSufficient) {
    return 'sufficient';
  }

  return 'sparse';
}
