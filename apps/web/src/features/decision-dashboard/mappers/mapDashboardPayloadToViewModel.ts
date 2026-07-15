import type { DashboardPayload } from '@/types/decisionDashboard';

export interface DecisionDashboardCardViewModel {
  readonly code: string;
  readonly title: string;
  readonly summary: string;
}

export interface DecisionDashboardViewModel {
  readonly question: string;
  readonly status: string;
  readonly dataState: DashboardPayload['data_state'];
  readonly action: {
    readonly id: string;
    readonly label: string;
    readonly rationale: string;
  };
  readonly priorityCards: readonly DecisionDashboardCardViewModel[];
  readonly secondaryCards: readonly DecisionDashboardCardViewModel[];
  readonly insightMessage?: string;
  readonly showSecondary: boolean;
  readonly showNextJourneyStage: boolean;
  readonly nextJourneyStageLabel: string;
  readonly nextJourneyStageSummary: string;
  readonly nextJourneyStageReason: string;
  readonly showAiBlock: false;
  readonly showEvolutionBanner: false;
}

export function mapDashboardPayloadToViewModel(
  payload: DashboardPayload,
): DecisionDashboardViewModel {
  return {
    question: payload.question,
    status: payload.status,
    dataState: payload.data_state,
    action: {
      id: payload.action_of_the_day.id,
      label: payload.action_of_the_day.label,
      rationale: payload.action_of_the_day.rationale,
    },
    priorityCards: payload.priority_cards.map((card) => ({
      code: card.code,
      title: card.title,
      summary: card.summary,
    })),
    secondaryCards: (payload.secondary_cards ?? []).map((card) => ({
      code: card.code,
      title: card.title,
      summary: card.summary,
    })),
    insightMessage: payload.insight?.message,
    showSecondary: payload.secondary_available,
    showNextJourneyStage: payload.next_journey_stage.visibility === 'available',
    nextJourneyStageLabel: payload.next_journey_stage.label,
    nextJourneyStageSummary: payload.next_journey_stage.summary,
    nextJourneyStageReason: payload.next_journey_stage.reason,
    showAiBlock: false,
    showEvolutionBanner: false,
  };
}
