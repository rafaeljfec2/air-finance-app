import { describe, expect, it } from 'vitest';

import type {
  DecisionDashboardSignals,
  ResolveDecisionDashboardInput,
} from '@/types/decisionDashboard';

import { resolveDecisionDashboard } from './resolveDecisionDashboard';

const sufficientSurvivorSignals = (): DecisionDashboardSignals => ({
  hasAnyTransactions: true,
  hasPayables: true,
  hasReceivables: true,
  hasCreditPressure: true,
  income: 5000,
  expenses: 3200,
  balance: 1800,
  isFirstAccess: false,
  enginePrimaryIssue: 'liquidity_risk',
  engineActionTitle: 'Prioritize the critical payment',
  engineActionDescription: 'Protect the cycle before optional spending',
  engineOrderingRationale: 'Outgoing commitments press the cycle this month',
  readyForNext: false,
});

function buildInput(
  overrides?: Partial<ResolveDecisionDashboardInput>,
): ResolveDecisionDashboardInput {
  return {
    archetype: 'survivor',
    signals: sufficientSurvivorSignals(),
    ...overrides,
  };
}

const FORBIDDEN_SURVIVOR_CODES = [
  'goals',
  'health',
  'reports',
  'planner',
  'C1',
  'I1',
  'E1',
] as const;

describe('resolveDecisionDashboard', () => {
  it('answers the survivor dominant question with action of the day when sufficient', () => {
    const payload = resolveDecisionDashboard(buildInput());

    expect(payload.archetype).toBe('survivor');
    expect(payload.data_state).toBe('sufficient');
    expect(payload.question).toContain('fechar');
    expect(payload.status.trim().length).toBeGreaterThan(0);
    expect(payload.action_of_the_day.label.trim().length).toBeGreaterThan(0);
    expect(payload.action_of_the_day.archetype).toBe('survivor');
    expect(payload.priority_cards.length).toBeLessThanOrEqual(3);
    expect(payload.next_journey_stage.reason.trim().length).toBeGreaterThan(0);
    expect(payload.ai_block).toBeUndefined();
    expect(payload.evolution_banner).toBeUndefined();
  });

  it('never includes goals, health, or reports cards for survivor', () => {
    const payload = resolveDecisionDashboard(buildInput());
    const codes = [
      ...payload.priority_cards.map((card) => card.code),
      ...(payload.secondary_cards ?? []).map((card) => card.code),
    ];

    for (const forbidden of FORBIDDEN_SURVIVOR_CODES) {
      expect(codes.some((code) => code.toLowerCase().includes(forbidden.toLowerCase()))).toBe(
        false,
      );
    }
  });

  it('keeps initial density within Spec limits', () => {
    const payload = resolveDecisionDashboard(buildInput());

    expect(payload.priority_cards.length).toBeLessThanOrEqual(3);
    expect(payload.insight === undefined || payload.insight.message.length > 0).toBe(true);
  });

  it('hides insight, AI, and evolution on no_data and uses capture action', () => {
    const payload = resolveDecisionDashboard(
      buildInput({
        signals: {
          hasAnyTransactions: false,
          hasPayables: false,
          hasReceivables: false,
          hasCreditPressure: false,
          income: 0,
          expenses: 0,
          balance: 0,
          isFirstAccess: false,
          readyForNext: false,
        },
      }),
    );

    expect(payload.data_state).toBe('no_data');
    expect(payload.insight).toBeUndefined();
    expect(payload.ai_block).toBeUndefined();
    expect(payload.evolution_banner).toBeUndefined();
    expect(payload.action_of_the_day.id).toContain('capture');
  });

  it('hides AI and evolution on first_access', () => {
    const payload = resolveDecisionDashboard(
      buildInput({
        signals: {
          ...sufficientSurvivorSignals(),
          isFirstAccess: true,
          hasAnyTransactions: false,
          hasPayables: false,
          hasReceivables: false,
          income: 0,
          expenses: 0,
        },
      }),
    );

    expect(payload.data_state).toBe('first_access');
    expect(payload.ai_block).toBeUndefined();
    expect(payload.evolution_banner).toBeUndefined();
  });

  it('builds organizer package with destination-focused question', () => {
    const payload = resolveDecisionDashboard(
      buildInput({
        archetype: 'organizer',
        signals: {
          ...sufficientSurvivorSignals(),
          topExpenseLabel: 'Moradia',
        },
      }),
    );

    expect(payload.archetype).toBe('organizer');
    expect(payload.question.toLowerCase()).toContain('dinheiro');
    expect(payload.priority_cards.some((card) => card.code.startsWith('O'))).toBe(true);
    expect(payload.priority_cards.every((card) => !card.code.startsWith('C'))).toBe(true);
  });

  it('builds builder, investor, and expander packages per matrix', () => {
    for (const archetype of ['builder', 'investor', 'expander'] as const) {
      const payload = resolveDecisionDashboard(buildInput({ archetype }));
      const prefix = archetype === 'builder' ? 'C' : archetype === 'investor' ? 'I' : 'E';

      expect(payload.archetype).toBe(archetype);
      expect(payload.priority_cards.some((card) => card.code.startsWith(prefix))).toBe(true);
      expect(payload.next_journey_stage.reason.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not claim survivor cycle is under control with payables but zero cashflow', () => {
    const payload = resolveDecisionDashboard(
      buildInput({
        signals: {
          hasAnyTransactions: false,
          hasPayables: true,
          hasReceivables: false,
          hasCreditPressure: false,
          income: 0,
          expenses: 0,
          balance: 0,
          isFirstAccess: false,
          readyForNext: false,
        },
      }),
    );

    expect(payload.status.toLowerCase()).not.toContain('sob controle');
    expect(payload.insight?.message.toLowerCase().includes('sob controle') ?? false).toBe(false);
  });
});
