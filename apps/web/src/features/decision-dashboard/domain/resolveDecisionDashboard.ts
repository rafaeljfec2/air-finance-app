import type { DashboardPayload, ResolveDecisionDashboardInput } from '@/types/decisionDashboard';

import { ARCHETYPE_PACKAGES } from './archetypePackages';
import { resolveDataState } from './dataStateResolver';
import { resolveNextJourneyStage } from './nextJourneyStage';

export function resolveDecisionDashboard(input: ResolveDecisionDashboardInput): DashboardPayload {
  const { archetype, signals } = input;
  const pkg = ARCHETYPE_PACKAGES[archetype];
  const dataState = resolveDataState(signals);
  const nextJourneyStage = resolveNextJourneyStage(archetype, signals.readyForNext);

  const isCaptureState = dataState === 'no_data' || dataState === 'first_access';
  const action = isCaptureState ? pkg.buildCaptureAction() : pkg.buildAction(signals);
  const priorityCards = pkg.buildPriorityCards(signals, action.id).slice(0, 3);
  const secondaryCards = pkg.buildSecondaryCards(signals);
  const allowInsight =
    dataState === 'sufficient' || dataState === 'advanced' || dataState === 'sparse';
  const insight = allowInsight ? pkg.buildInsight(signals) : undefined;
  const preserve = pkg.buildPreserve?.(signals);
  const avoid = pkg.buildAvoid?.(signals);
  const history = pkg.buildHistory?.(signals);

  return {
    archetype,
    data_state: dataState,
    question: pkg.question,
    status: pkg.buildStatus(signals),
    status_lines: pkg.buildStatusLines?.(signals),
    action_of_the_day: action,
    priority_cards: priorityCards,
    insight,
    preserve,
    avoid,
    history,
    secondary_available: secondaryCards.length > 0,
    secondary_cards: secondaryCards,
    next_journey_stage: nextJourneyStage,
  };
}
