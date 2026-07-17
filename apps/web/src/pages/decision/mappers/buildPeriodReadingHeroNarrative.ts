export interface PeriodReadingHeadline {
  readonly lead: string;
  readonly emphasis: string;
}

/**
 * Deterministic hero headline from evaluate-auto primary_issue (SPEC-08).
 * No guilt / fear wording — states the mechanical situation.
 */
const HEADLINES: Readonly<Record<string, PeriodReadingHeadline>> = {
  debt_pressure: {
    lead: 'Parte relevante da sua renda',
    emphasis: 'ainda está comprometida com dívidas.',
  },
  liquidity_risk: {
    lead: 'O caixa do período',
    emphasis: 'tem pouca folga para o que vem pela frente.',
  },
  credit_overuse: {
    lead: 'O uso de crédito no período',
    emphasis: 'reduz a margem de manobra do mês.',
  },
  high_commitment: {
    lead: 'Boa parte da sua renda',
    emphasis: 'já tem destino antes do mês acabar.',
  },
  low_surplus: {
    lead: 'A sobra do período',
    emphasis: 'está estreita para absorver imprevistos.',
  },
  low_savings: {
    lead: 'Está ficando pouco',
    emphasis: 'para reserva e para o futuro.',
  },
  high_fixed_cost: {
    lead: 'Muito do mês é conta fixa',
    emphasis: 'com pouca margem para manobra rápida.',
  },
  data_incomplete: {
    lead: 'Ainda faltam fatos neste perfil',
    emphasis: 'para uma leitura segura do período.',
  },
  healthy: {
    lead: 'Neste período,',
    emphasis: 'nada aponta pressão dominante.',
  },
};

const FALLBACK: PeriodReadingHeadline = {
  lead: 'Há um ponto de atenção neste período',
  emphasis: 'que vale acompanhar com calma.',
};

export function buildPeriodReadingHeadline(primaryIssue: string): PeriodReadingHeadline {
  const key = primaryIssue.trim().toLowerCase();
  if (key === '') {
    return FALLBACK;
  }
  return HEADLINES[key] ?? FALLBACK;
}

export function shouldShowImprovementBanner(input: {
  readonly todayCommittedPct: number;
  readonly in90DaysCommittedPct: number;
}): boolean {
  return input.in90DaysCommittedPct < input.todayCommittedPct;
}

export function buildImprovementBannerText(expectedOutcome: string): string | null {
  const trimmed = expectedOutcome.trim();
  if (trimmed === '') {
    return null;
  }
  return trimmed;
}
