export type DashboardSurfaceState = 'awaiting_company' | 'loading' | 'error' | 'ready';

export interface DashboardSurfaceStateInput {
  readonly companyId: string;
  readonly summaryLoading: boolean;
  readonly budgetLoading: boolean;
  readonly recentTxLoading: boolean;
  readonly expensesLoading: boolean;
  readonly indebtednessLoading: boolean;
  readonly summaryError: boolean;
  readonly budgetError: boolean;
  readonly recentTxError: boolean;
  readonly hasSummaryData: boolean;
}

export function resolveDashboardSurfaceState(
  input: DashboardSurfaceStateInput,
): DashboardSurfaceState {
  if (input.companyId.length === 0) {
    return 'awaiting_company';
  }

  const coreLoading =
    input.summaryLoading ||
    input.budgetLoading ||
    input.recentTxLoading ||
    input.expensesLoading ||
    input.indebtednessLoading;

  if (coreLoading) {
    return 'loading';
  }

  const coreError = input.summaryError || input.budgetError || input.recentTxError;
  if (coreError || !input.hasSummaryData) {
    return 'error';
  }

  return 'ready';
}
