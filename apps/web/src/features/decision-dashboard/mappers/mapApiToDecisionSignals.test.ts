import { describe, expect, it } from 'vitest';

import { mapApiToDecisionSignals } from './mapApiToDecisionSignals';

describe('mapApiToDecisionSignals', () => {
  it('maps empty sources to no movement and no commitments', () => {
    const signals = mapApiToDecisionSignals({
      summary: { income: 0, expenses: 0, balance: 0 },
      payablesCount: 0,
      receivablesCount: 0,
      transactionsCount: 0,
      hasCreditPressure: false,
      isFirstAccess: true,
      readyForNext: false,
    });

    expect(signals.hasAnyTransactions).toBe(false);
    expect(signals.hasPayables).toBe(false);
    expect(signals.hasReceivables).toBe(false);
    expect(signals.isFirstAccess).toBe(true);
  });

  it('maps engine action fields and top expense label', () => {
    const signals = mapApiToDecisionSignals({
      summary: { income: 1000, expenses: 400, balance: 600 },
      payablesCount: 2,
      receivablesCount: 1,
      transactionsCount: 5,
      hasCreditPressure: true,
      isFirstAccess: false,
      readyForNext: false,
      engine: {
        primary_issue: 'liquidity_risk',
        actions: [
          {
            title: 'Prioritize rent',
            description: 'Protect the cycle',
          },
        ],
        ordering_rationale: 'Outgoing pressure this cycle',
      },
      topExpenseLabel: 'Moradia',
    });

    expect(signals.hasPayables).toBe(true);
    expect(signals.hasReceivables).toBe(true);
    expect(signals.hasCreditPressure).toBe(true);
    expect(signals.enginePrimaryIssue).toBe('liquidity_risk');
    expect(signals.engineActionTitle).toBe('Prioritize rent');
    expect(signals.engineActionDescription).toBe('Protect the cycle');
    expect(signals.engineOrderingRationale).toBe('Outgoing pressure this cycle');
    expect(signals.topExpenseLabel).toBe('Moradia');
  });
});
