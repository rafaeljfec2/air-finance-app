import type { CompletePlanResponse } from '@/services/completePlanService';

export interface PeriodReadingBehaviorCard {
  readonly id: string;
  readonly title: string;
  readonly evidence: string;
  readonly interpretation: string;
}

/**
 * Behavior cards from complete-plan only — no subscriptions/interest (SPEC-08 backlog).
 */
export function buildPeriodReadingBehaviorCards(
  plan: CompletePlanResponse,
): readonly PeriodReadingBehaviorCard[] {
  const cards: PeriodReadingBehaviorCard[] = [];
  const peaks = plan.behavior.peakDaysOfMonth ?? plan.variableSpending.peakDaysOfMonth;

  if (peaks != null && peaks.length >= 2) {
    const sorted = [...peaks].sort((a, b) => a - b);
    cards.push({
      id: 'peaks',
      title: 'Picos de gastos',
      evidence: `Entre os dias ${sorted[0]} e ${sorted[sorted.length - 1]}`,
      interpretation: 'Concentração de despesas variáveis nestes dias do mês.',
    });
  } else if (peaks != null && peaks.length === 1) {
    cards.push({
      id: 'peaks',
      title: 'Picos de gastos',
      evidence: `Dia ${peaks[0]}`,
      interpretation: 'Um dia do mês concentra mais gasto variável.',
    });
  }

  const top = plan.variableSpending.topCategories[0] ?? plan.behavior.topCategories[0];
  if (top !== undefined) {
    cards.push({
      id: 'top-category',
      title: 'Categoria dominante',
      evidence: `${top.name} · ${Math.round(top.share * 100)}%`,
      interpretation: 'Maior fatia dos gastos variáveis no período.',
    });
  }

  cards.push({
    id: 'card-share',
    title: 'Uso do cartão',
    evidence:
      plan.variableSpending.bucketHealth === 'critical'
        ? 'Gastos variáveis sob pressão'
        : plan.variableSpending.bucketHealth === 'attention'
          ? 'Gastos variáveis pedem atenção'
          : 'Gastos variáveis sob controle',
    interpretation: 'Leitura do bucket variável do período — sem inventar % de cartão.',
  });

  if (plan.numbers.committedPct > 0) {
    cards.push({
      id: 'commitment',
      title: 'Comprometimento',
      evidence: `${Math.round(plan.numbers.committedPct * 100)}% da renda em parcelas`,
      interpretation: 'Parcela da renda já comprometida com dívidas ativas.',
    });
  }

  return cards;
}
