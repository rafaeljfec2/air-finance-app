import type { CompletePlanResponse } from '@/services/completePlanService';

export interface PeriodReadingPlanStep {
  readonly number: 1 | 2 | 3;
  readonly title: string;
  readonly tone: 'critical' | 'attention' | 'positive';
  readonly items: readonly string[];
}

/**
 * Reads the existing complete-plan — does not invent a new recovery engine (SPEC-08).
 */
export function buildPeriodReadingPlanSteps(
  plan: CompletePlanResponse,
): readonly PeriodReadingPlanStep[] {
  const rules = plan.personalRules.map((rule) => rule.text).filter((text) => text.trim() !== '');
  const suggestion = plan.installmentsStrategy.suggestion.trim();
  const simpleRule = plan.simpleRule.trim();

  const stopWorsening = rules.slice(0, 3);
  const breathe =
    suggestion !== '' ? [suggestion, ...rules.slice(3, 5)].filter(Boolean) : rules.slice(3, 6);
  const buildFreedom = [
    plan.numbers.reductionNeeded > 0
      ? `Reduzir cerca de ${formatMoney(plan.numbers.reductionNeeded)}/mês no comprometimento`
      : 'Manter o comprometimento dentro da faixa saudável',
    simpleRule !== '' ? simpleRule : null,
    ...rules.slice(6, 8),
  ].filter((item): item is string => item != null && item.trim() !== '');

  return [
    {
      number: 1,
      title: 'Pare de piorar',
      tone: 'critical',
      items: stopWorsening.length > 0 ? stopWorsening : ['Não criar dívida nova neste período'],
    },
    {
      number: 2,
      title: 'Volte a respirar',
      tone: 'attention',
      items: breathe.length > 0 ? breathe : ['Revisar parcelas e juros com calma'],
    },
    {
      number: 3,
      title: 'Construa liberdade',
      tone: 'positive',
      items: buildFreedom.length > 0 ? buildFreedom : ['Aumentar a folga mês a mês'],
    },
  ];
}

function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
