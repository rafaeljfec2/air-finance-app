import type {
  CompletePlanNumbers,
  CompletePlanVariableSpending,
} from '@/services/completePlanService';

export interface PeriodReadingPressureCard {
  readonly id: string;
  readonly title: string;
  readonly amount: number;
  readonly percentOfIncome: number | null;
  readonly tone: 'attention' | 'critical' | 'positive';
}

export function buildPeriodReadingPressure(input: {
  readonly numbers: CompletePlanNumbers;
  readonly variableSpending: CompletePlanVariableSpending;
}): readonly PeriodReadingPressureCard[] {
  const income = input.numbers.netIncome;
  const committedPct = input.numbers.committedPct;
  const variablePct = input.variableSpending.percentOfIncome;
  const freeAmount = Math.max(
    0,
    income - input.numbers.totalCommitted - input.variableSpending.totalVariable,
  );
  const freePct = income > 0 ? freeAmount / income : null;

  return [
    {
      id: 'installments',
      title: 'Parcelas e dívidas',
      amount: input.numbers.totalCommitted,
      percentOfIncome: committedPct,
      tone: committedPct >= 0.5 ? 'critical' : 'attention',
    },
    {
      id: 'variable',
      title: 'Gastos variáveis',
      amount: input.variableSpending.totalVariable,
      percentOfIncome: variablePct,
      tone: input.variableSpending.bucketHealth === 'critical' ? 'critical' : 'attention',
    },
    {
      id: 'free',
      title: 'Renda livre',
      amount: freeAmount,
      percentOfIncome: freePct,
      tone: 'positive',
    },
  ];
}
