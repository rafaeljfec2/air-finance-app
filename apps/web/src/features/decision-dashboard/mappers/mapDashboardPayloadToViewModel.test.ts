import { describe, expect, it } from 'vitest';

import type { DashboardPayload } from '@/types/decisionDashboard';

import { mapDashboardPayloadToViewModel } from './mapDashboardPayloadToViewModel';

const basePayload = (): DashboardPayload => ({
  archetype: 'survivor',
  data_state: 'sufficient',
  question: 'Vou conseguir fechar este mês?',
  status: 'O ciclo está em risco.',
  action_of_the_day: {
    id: 'a1',
    label: 'Prioritize payment',
    rationale: 'Protect the cycle',
    archetype: 'survivor',
    urgency: 'today',
  },
  priority_cards: [
    {
      code: 'S2',
      title: 'Saídas',
      summary: 'Critical outs',
      supports_action_id: 'a1',
      visibility: 'priority',
    },
  ],
  insight: { id: 'i1', message: 'Focus on the cycle' },
  secondary_available: true,
  secondary_cards: [
    {
      code: 'S-sec-1',
      title: 'Recent',
      summary: 'Few moves',
      supports_action_id: 'none',
      visibility: 'secondary',
    },
  ],
  next_journey_stage: {
    id: 'see',
    label: 'Enxergar',
    summary: 'Clarity next',
    reason: 'Because clarity follows cycle stability',
    visibility: 'hidden',
  },
});

describe('mapDashboardPayloadToViewModel', () => {
  it('maps domain payload to UI view model without exposing AI or evolution in wave 1', () => {
    const vm = mapDashboardPayloadToViewModel(basePayload());

    expect(vm.question).toBe('Vou conseguir fechar este mês?');
    expect(vm.status).toBe('O ciclo está em risco.');
    expect(vm.action.label).toBe('Prioritize payment');
    expect(vm.priorityCards).toHaveLength(1);
    expect(vm.insightMessage).toBe('Focus on the cycle');
    expect(vm.showSecondary).toBe(true);
    expect(vm.showNextJourneyStage).toBe(false);
    expect(vm.nextJourneyStageReason).toBe('Because clarity follows cycle stability');
    expect(vm.showAiBlock).toBe(false);
    expect(vm.showEvolutionBanner).toBe(false);
  });

  it('shows next journey stage only when visibility is available', () => {
    const payload = basePayload();
    const vm = mapDashboardPayloadToViewModel({
      ...payload,
      next_journey_stage: { ...payload.next_journey_stage, visibility: 'available' },
    });

    expect(vm.showNextJourneyStage).toBe(true);
  });
});
