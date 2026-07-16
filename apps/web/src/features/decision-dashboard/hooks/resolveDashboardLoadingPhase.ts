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
  readonly description: string;
  readonly status: DashboardLoadingStepStatus;
}

export interface DashboardLoadingPhase {
  readonly message: string;
  readonly steps: readonly DashboardLoadingStep[];
}

const LOADING_STEP_DEFINITIONS = [
  {
    id: 'movements',
    label: 'Organizando movimentações',
    description: 'Reunindo as movimentações deste período.',
    isPending: (input: DashboardLoadingPhaseInput) => input.recentTxLoading,
  },
  {
    id: 'inflows_outflows',
    label: 'Entendendo entradas e saídas',
    description: 'Classificando as transações do mês.',
    isPending: (input: DashboardLoadingPhaseInput) => input.summaryLoading,
  },
  {
    id: 'commitments',
    label: 'Identificando compromissos',
    description: 'Mapeando seus gastos fixos e parcelas.',
    isPending: (input: DashboardLoadingPhaseInput) => input.budgetLoading,
  },
  {
    id: 'pressure',
    label: 'Avaliando pressão financeira',
    description: 'Verificando se o crédito está ajudando ou escondendo pressão no fluxo.',
    isPending: (input: DashboardLoadingPhaseInput) => input.indebtednessLoading,
  },
  {
    id: 'history_patterns',
    label: 'Cruzando padrões do histórico',
    description: 'Comparando com os últimos 6 meses.',
    isPending: (input: DashboardLoadingPhaseInput) => input.expensesLoading,
  },
  {
    id: 'report',
    label: 'Escrevendo seu parecer',
    description: 'Montando insights e recomendações.',
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
    description: step.description,
    status:
      index < clampedIndex
        ? ('done' as const)
        : index === clampedIndex
          ? ('active' as const)
          : ('pending' as const),
  }));

  return {
    message: LOADING_STEP_DEFINITIONS[clampedIndex]?.label ?? 'Escrevendo seu parecer',
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
