export interface DashboardLoadingPhaseInput {
  readonly summaryLoading: boolean;
  readonly budgetLoading: boolean;
  readonly recentTxLoading: boolean;
  readonly expensesLoading: boolean;
  readonly indebtednessLoading: boolean;
}

export type DashboardLoadingStepStatus = 'done' | 'active' | 'pending';

export interface DashboardLoadingStep {
  readonly id: string;
  readonly label: string;
  readonly status: DashboardLoadingStepStatus;
}

export interface DashboardLoadingPhase {
  readonly message: string;
  readonly steps: readonly DashboardLoadingStep[];
}

const LOADING_STEP_DEFINITIONS = [
  {
    id: 'accounts_budget',
    label: 'Organizando contas e planejamento do mês…',
    isPending: (input: DashboardLoadingPhaseInput) => input.budgetLoading,
  },
  {
    id: 'summary',
    label: 'Lendo entradas, saídas e saldo do mês…',
    isPending: (input: DashboardLoadingPhaseInput) => input.summaryLoading,
  },
  {
    id: 'movements',
    label: 'Revisando movimentações recentes…',
    isPending: (input: DashboardLoadingPhaseInput) =>
      input.recentTxLoading || input.expensesLoading,
  },
  {
    id: 'credit',
    label: 'Verificando pressão de crédito…',
    isPending: (input: DashboardLoadingPhaseInput) => input.indebtednessLoading,
  },
  {
    id: 'assembly',
    label: 'Montando seu parecer de hoje…',
    isPending: () => false,
  },
] as const;

export const DASHBOARD_LOADING_STEP_COUNT = LOADING_STEP_DEFINITIONS.length;
export const DASHBOARD_LOADING_STEP_MIN_MS = 700;

function buildLoadingPhase(activeIndex: number): DashboardLoadingPhase {
  const clampedIndex = Math.min(Math.max(activeIndex, 0), LOADING_STEP_DEFINITIONS.length - 1);

  const steps = LOADING_STEP_DEFINITIONS.map((step, index) => ({
    id: step.id,
    label: step.label,
    status:
      index < clampedIndex
        ? ('done' as const)
        : index === clampedIndex
          ? ('active' as const)
          : ('pending' as const),
  }));

  return {
    message: LOADING_STEP_DEFINITIONS[clampedIndex]?.label ?? 'Montando seu parecer de hoje…',
    steps,
  };
}

function resolveActiveStepIndex(input: DashboardLoadingPhaseInput): number {
  const index = LOADING_STEP_DEFINITIONS.findIndex((step) => step.isPending(input));
  return index === -1 ? LOADING_STEP_DEFINITIONS.length - 1 : index;
}

export function resolveDashboardLoadingPhaseFromIndex(activeIndex: number): DashboardLoadingPhase {
  return buildLoadingPhase(activeIndex);
}

export function resolveDashboardLoadingPhase(
  input: DashboardLoadingPhaseInput,
): DashboardLoadingPhase {
  return buildLoadingPhase(resolveActiveStepIndex(input));
}
