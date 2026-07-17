import type { CompletePlanNumbers } from '@/services/completePlanService';

export interface PeriodReadingJourneyStage {
  readonly id: string;
  readonly title: string;
  readonly valueLabel: string;
  readonly subtitle: string;
  readonly tone: 'positive' | 'neutral' | 'attention' | 'critical';
}

export interface PeriodReadingJourneyInput {
  readonly income: number;
  readonly expenses: number;
  readonly numbers: CompletePlanNumbers;
}

/**
 * Five factual stages for "Como chegamos aqui?" (SPEC-08 container 2).
 */
export function buildPeriodReadingJourney(
  input: PeriodReadingJourneyInput,
): readonly PeriodReadingJourneyStage[] {
  const freeIncome = Math.max(0, input.income - input.expenses);
  const freePct = input.income > 0 ? freeIncome / input.income : 0;
  const committedPct = input.numbers.committedPct;
  const pressureTone: PeriodReadingJourneyStage['tone'] =
    committedPct >= 0.5 ? 'critical' : committedPct >= 0.35 ? 'attention' : 'neutral';

  return [
    {
      id: 'income',
      title: 'Receita',
      valueLabel: formatMoney(input.income),
      subtitle: 'Entradas do mês',
      tone: 'positive',
    },
    {
      id: 'commitments',
      title: 'Compromissos',
      valueLabel: formatMoney(input.expenses),
      subtitle: 'Saídas do período',
      tone: 'attention',
    },
    {
      id: 'installments',
      title: 'Parcelas e dívidas',
      valueLabel: formatMoney(input.numbers.totalCommitted),
      subtitle: 'Comprometimento mensal',
      tone: 'attention',
    },
    {
      id: 'slack',
      title: freePct < 0.25 ? 'Pouca folga' : 'Folga',
      valueLabel: `${Math.round(freePct * 100)}% da renda`,
      subtitle: freePct < 0.25 ? 'Liberdade reduzida' : 'Margem disponível',
      tone: freePct < 0.25 ? 'attention' : 'neutral',
    },
    {
      id: 'pressure',
      title: 'Pressão',
      valueLabel: `${Math.round(committedPct * 100)}% comprometido`,
      subtitle: pressureTone === 'critical' ? 'Decisões limitadas' : 'Monitorar o período',
      tone: pressureTone,
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
