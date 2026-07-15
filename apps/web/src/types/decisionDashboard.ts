export type FinancialArchetype = 'survivor' | 'organizer' | 'builder' | 'investor' | 'expander';

export type DashboardDataState = 'first_access' | 'no_data' | 'sparse' | 'sufficient' | 'advanced';

export type DecisionCardVisibility = 'priority' | 'secondary' | 'hidden';

export type ActionUrgency = 'now' | 'today' | 'this_cycle';

export type JourneyStageId =
  | 'see'
  | 'generate_cash'
  | 'build_wealth'
  | 'make_money_work'
  | 'expand';

export interface ActionOfTheDay {
  readonly id: string;
  readonly label: string;
  readonly rationale: string;
  readonly archetype: FinancialArchetype;
  readonly urgency: ActionUrgency;
  readonly completion_hint?: string;
}

export interface DecisionCard {
  readonly code: string;
  readonly title: string;
  readonly summary: string;
  readonly supports_action_id: string;
  readonly visibility: DecisionCardVisibility;
}

export interface DecisionInsight {
  readonly id: string;
  readonly message: string;
}

export interface NextJourneyStage {
  readonly id: JourneyStageId;
  readonly label: string;
  readonly summary: string;
  readonly reason: string;
  readonly visibility: 'hidden' | 'available';
}

export interface DashboardPayload {
  readonly archetype: FinancialArchetype;
  readonly data_state: DashboardDataState;
  readonly question: string;
  readonly status: string;
  readonly action_of_the_day: ActionOfTheDay;
  readonly priority_cards: readonly DecisionCard[];
  readonly insight?: DecisionInsight;
  readonly evolution_banner?: never;
  readonly ai_block?: never;
  readonly secondary_available: boolean;
  readonly next_journey_stage: NextJourneyStage;
  readonly secondary_cards?: readonly DecisionCard[];
}

export interface DecisionDashboardSignals {
  readonly hasAnyTransactions: boolean;
  readonly hasPayables: boolean;
  readonly hasReceivables: boolean;
  readonly hasCreditPressure: boolean;
  readonly income: number;
  readonly expenses: number;
  readonly balance: number;
  readonly isFirstAccess: boolean;
  readonly enginePrimaryIssue?: string;
  readonly engineActionTitle?: string;
  readonly engineActionDescription?: string;
  readonly engineOrderingRationale?: string;
  readonly topExpenseLabel?: string;
  readonly readyForNext: boolean;
}

export interface ResolveDecisionDashboardInput {
  readonly archetype: FinancialArchetype;
  readonly signals: DecisionDashboardSignals;
}
