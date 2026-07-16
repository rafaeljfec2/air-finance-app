import { describe, expect, it } from 'vitest';

import {
  buildBehaviorHistoryLines,
  deriveBehaviorEvidence,
  type BehaviorHistoryItem,
} from './deriveBehaviorEvidence';

function item(
  partial: Pick<BehaviorHistoryItem, 'description' | 'amount' | 'date' | 'kind'>,
): BehaviorHistoryItem {
  return partial;
}

describe('deriveBehaviorEvidence', () => {
  it('stays silent on savings when history is thin', () => {
    const evidence = deriveBehaviorEvidence([
      item({
        description: 'Café',
        amount: 20,
        date: '2026-07-01',
        kind: 'expense',
      }),
    ]);
    expect(evidence.hasSufficientHistory).toBe(false);
    expect(buildBehaviorHistoryLines(evidence)[0]).toMatch(/histórico suficiente/i);
  });

  it('detects credit-as-cash across months and recurrence with evidence', () => {
    const items: BehaviorHistoryItem[] = [];
    for (let month = 1; month <= 4; month += 1) {
      items.push(
        item({
          description: 'Pagamento recebido',
          amount: 12000,
          date: `2026-0${month}-10`,
          kind: 'income',
        }),
      );
      items.push(
        item({
          description: 'Academia - Parcela 1/12',
          amount: 99,
          date: `2026-0${month}-05`,
          kind: 'expense',
        }),
      );
      items.push(
        item({
          description: 'Mercado Extra',
          amount: 400,
          date: `2026-0${month}-12`,
          kind: 'expense',
        }),
      );
      items.push(
        item({
          description: 'Combustível',
          amount: 200,
          date: `2026-0${month}-18`,
          kind: 'expense',
        }),
      );
      items.push(
        item({
          description: 'Farmácia',
          amount: 80,
          date: `2026-0${month}-20`,
          kind: 'expense',
        }),
      );
    }

    const evidence = deriveBehaviorEvidence(items);
    expect(evidence.hasSufficientHistory).toBe(true);
    expect(evidence.creditAsCashPattern).toBe(true);
    expect(evidence.recurringPressure?.label).toMatch(/Academia|Mercado|Combustível|Farmácia/i);

    const lines = buildBehaviorHistoryLines(evidence);
    expect(lines.some((line) => /cartão cobre o mês/i.test(line))).toBe(true);
    expect(lines.join(' ')).not.toMatch(/supérfluo|você gasta mal/i);
  });
});
