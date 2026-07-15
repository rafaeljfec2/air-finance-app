import type { DashboardSummary } from '@/types/dashboard';
import type { IndebtednessMetrics } from '@/types/indebtedness';
import { formatCurrency } from '@/utils/formatters';

import { getPillarTemplate } from '../copy/pillarInterpretationTemplates';
import type {
  CapacityState,
  FinancialHealthCheckup,
  FinancialHealthPillar,
  PillarId,
} from '../types';
import { PILLAR_ORDER } from '../types';

export interface LiveMetricsInput {
  readonly summary: DashboardSummary | null | undefined;
  readonly indebtedness: IndebtednessMetrics | null | undefined;
}

interface BuiltPillarCore {
  readonly id: PillarId;
  readonly name: string;
  readonly question: string;
  readonly primaryLabel: string;
  readonly primaryValue: number | null;
  readonly primaryFormatted: string | null;
  readonly state: CapacityState;
  readonly connections: readonly string[];
  readonly hasGap: boolean;
  readonly exploreHint: string | null;
}

function mapCreditState(
  status: IndebtednessMetrics['creditUtilization']['status'] | undefined,
): CapacityState {
  if (!status) {
    return 'inconclusive';
  }
  switch (status) {
    case 'low':
      return 'excellent';
    case 'moderate':
      return 'good';
    case 'high':
      return 'attention';
    case 'critical':
      return 'critical';
    default:
      return 'inconclusive';
  }
}

function mapLiquidityState(
  status: IndebtednessMetrics['liquidity']['status'] | undefined,
): CapacityState {
  if (!status) {
    return 'inconclusive';
  }
  switch (status) {
    case 'positive':
      return 'good';
    case 'negative':
      return 'attention';
    case 'critical':
      return 'critical';
    default:
      return 'inconclusive';
  }
}

function mapFlowState(
  balance: number | null | undefined,
  income: number | null | undefined,
): CapacityState {
  if (balance === null || balance === undefined || income === null || income === undefined) {
    return 'inconclusive';
  }
  if (income <= 0 && balance === 0) {
    return 'inconclusive';
  }
  const margin = income > 0 ? balance / income : balance;
  if (balance > 0 && margin >= 0.15) {
    return 'excellent';
  }
  if (balance > 0) {
    return 'good';
  }
  if (balance >= -Math.max(income * 0.1, 1)) {
    return 'attention';
  }
  return 'critical';
}

function mapStructureState(debtToRevenuePct: number | null | undefined): CapacityState {
  if (debtToRevenuePct === null || debtToRevenuePct === undefined) {
    return 'inconclusive';
  }
  if (debtToRevenuePct < 30) {
    return 'excellent';
  }
  if (debtToRevenuePct < 50) {
    return 'good';
  }
  if (debtToRevenuePct < 80) {
    return 'attention';
  }
  return 'critical';
}

function mapRunwayMonths(
  cash: number,
  monthlyExpenses: number,
): { months: number | null; state: CapacityState } {
  if (monthlyExpenses <= 0) {
    return { months: null, state: 'inconclusive' };
  }
  const months = cash / monthlyExpenses;
  if (months >= 3) {
    return { months, state: 'excellent' };
  }
  if (months >= 1) {
    return { months, state: 'good' };
  }
  if (months >= 0.25) {
    return { months, state: 'attention' };
  }
  return { months, state: 'critical' };
}

function buildPillar(core: BuiltPillarCore): FinancialHealthPillar {
  const template = getPillarTemplate(core.id, core.state);
  return {
    ...core,
    interpretation: template.interpretation,
    influencers: {
      improves: template.improves,
      worsens: template.worsens,
    },
    summarySentence: template.summarySentence,
  };
}

function buildLiquidity(
  indebtedness: IndebtednessMetrics | null | undefined,
): FinancialHealthPillar {
  if (!indebtedness) {
    return buildPillar({
      id: 'liquidity',
      name: 'Liquidez',
      question: 'Consigo operar agora e no horizonte curto?',
      primaryLabel: 'Caixa disponível',
      primaryValue: null,
      primaryFormatted: null,
      state: 'inconclusive',
      connections: ['Crédito', 'Fluxo', 'Resiliência'],
      hasGap: true,
      exploreHint: null,
    });
  }

  const available = indebtedness.liquidity.available;
  return buildPillar({
    id: 'liquidity',
    name: 'Liquidez',
    question: 'Consigo operar agora e no horizonte curto?',
    primaryLabel: 'Caixa disponível',
    primaryValue: available,
    primaryFormatted: formatCurrency(available),
    state: mapLiquidityState(indebtedness.liquidity.status),
    connections: ['Crédito', 'Fluxo', 'Resiliência'],
    hasGap: false,
    exploreHint: `Obrigações curtas: ${formatCurrency(indebtedness.liquidity.obligations)}`,
  });
}

function buildFlow(summary: DashboardSummary | null | undefined): FinancialHealthPillar {
  if (!summary) {
    return buildPillar({
      id: 'flow',
      name: 'Fluxo',
      question: 'O ciclo gera folga de verdade?',
      primaryLabel: 'Resultado do período',
      primaryValue: null,
      primaryFormatted: null,
      state: 'inconclusive',
      connections: ['Estrutura', 'Liquidez', 'Patrimônio'],
      hasGap: true,
      exploreHint: null,
    });
  }

  return buildPillar({
    id: 'flow',
    name: 'Fluxo',
    question: 'O ciclo gera folga de verdade?',
    primaryLabel: 'Resultado do período',
    primaryValue: summary.balance,
    primaryFormatted: formatCurrency(summary.balance),
    state: mapFlowState(summary.balance, summary.income),
    connections: ['Estrutura', 'Liquidez', 'Patrimônio'],
    hasGap: false,
    exploreHint: `Receita ${formatCurrency(summary.income)} · Despesa ${formatCurrency(summary.expenses)}`,
  });
}

function buildStructure(
  indebtedness: IndebtednessMetrics | null | undefined,
): FinancialHealthPillar {
  const pct = indebtedness?.debtToRevenue.percentage;
  if (pct === undefined || pct === null || !indebtedness) {
    return buildPillar({
      id: 'structure',
      name: 'Estrutura',
      question: 'Quão rígido ou ajustável é o sistema?',
      primaryLabel: 'Endividamento sobre renda (proxy)',
      primaryValue: null,
      primaryFormatted: null,
      state: 'inconclusive',
      connections: ['Fluxo', 'Liquidez', 'Crédito'],
      hasGap: true,
      exploreHint: 'FIN-12/13/14 canônicos ainda não disponíveis — proxy parcial.',
    });
  }

  return buildPillar({
    id: 'structure',
    name: 'Estrutura',
    question: 'Quão rígido ou ajustável é o sistema?',
    primaryLabel: 'Endividamento sobre renda (proxy)',
    primaryValue: pct,
    primaryFormatted: `${pct.toFixed(1)}%`,
    state: mapStructureState(pct),
    connections: ['Fluxo', 'Liquidez', 'Crédito'],
    hasGap: true,
    exploreHint: 'Proxy de rigidez via dívida/renda — não é FIN-12 completo.',
  });
}

function buildCredit(indebtedness: IndebtednessMetrics | null | undefined): FinancialHealthPillar {
  if (!indebtedness) {
    return buildPillar({
      id: 'credit',
      name: 'Crédito',
      question: 'Crédito é ponte ou muleta do sistema?',
      primaryLabel: 'Utilização do crédito',
      primaryValue: null,
      primaryFormatted: null,
      state: 'inconclusive',
      connections: ['Liquidez', 'Fluxo', 'Resiliência', 'Patrimônio'],
      hasGap: true,
      exploreHint: null,
    });
  }

  const percentage = indebtedness.creditUtilization.percentage;
  return buildPillar({
    id: 'credit',
    name: 'Crédito',
    question: 'Crédito é ponte ou muleta do sistema?',
    primaryLabel: 'Utilização do crédito',
    primaryValue: percentage,
    primaryFormatted: `${percentage.toFixed(1)}%`,
    state: mapCreditState(indebtedness.creditUtilization.status),
    connections: ['Liquidez', 'Fluxo', 'Resiliência', 'Patrimônio'],
    hasGap: false,
    exploreHint: `Utilizado ${formatCurrency(indebtedness.creditUtilization.used)} de ${formatCurrency(indebtedness.creditUtilization.total)}`,
  });
}

function buildResilience(
  indebtedness: IndebtednessMetrics | null | undefined,
  summary: DashboardSummary | null | undefined,
): FinancialHealthPillar {
  const cash = indebtedness?.liquidity.available;
  const expenses = summary?.expenses;
  if (cash === undefined || cash === null || expenses === undefined || expenses === null) {
    return buildPillar({
      id: 'resilience',
      name: 'Resiliência',
      question: 'Quanto choque o sistema aguenta?',
      primaryLabel: 'Runway estimado (meses)',
      primaryValue: null,
      primaryFormatted: null,
      state: 'inconclusive',
      connections: ['Liquidez', 'Crédito', 'Patrimônio'],
      hasGap: true,
      exploreHint: 'Reserva marcada (FIN-08) ainda não disponível.',
    });
  }

  const { months, state } = mapRunwayMonths(cash, expenses);
  return buildPillar({
    id: 'resilience',
    name: 'Resiliência',
    question: 'Quanto choque o sistema aguenta?',
    primaryLabel: 'Runway estimado (meses)',
    primaryValue: months,
    primaryFormatted: months === null ? null : `${months.toFixed(1)} meses`,
    state,
    connections: ['Liquidez', 'Crédito', 'Patrimônio'],
    hasGap: true,
    exploreHint: 'Estimativa caixa ÷ despesa do período — não é reserva marcada.',
  });
}

function buildWealth(indebtedness: IndebtednessMetrics | null | undefined): FinancialHealthPillar {
  const net = indebtedness?.accountBalances.net;
  if (net === undefined || net === null) {
    return buildPillar({
      id: 'wealth',
      name: 'Patrimônio',
      question: 'O que a posição patrimonial observa sobre o sistema?',
      primaryLabel: 'Posição líquida observável',
      primaryValue: null,
      primaryFormatted: null,
      state: 'inconclusive',
      connections: ['Fluxo', 'Crédito', 'Liquidez'],
      hasGap: true,
      exploreHint: 'Inventário FIN-09 incompleto — saldos líquidos são proxy parcial.',
    });
  }

  let state: CapacityState = 'inconclusive';
  if (net > 0) {
    state = 'attention';
  } else if (net < 0) {
    state = 'critical';
  }

  return buildPillar({
    id: 'wealth',
    name: 'Patrimônio',
    question: 'O que a posição patrimonial observa sobre o sistema?',
    primaryLabel: 'Saldos líquidos (proxy)',
    primaryValue: net,
    primaryFormatted: formatCurrency(net),
    state,
    connections: ['Fluxo', 'Crédito', 'Liquidez'],
    hasGap: true,
    exploreHint: 'Proxy de saldos — não inventário patrimonial completo (FIN-09).',
  });
}

function buildClosingSynthesis(pillars: readonly FinancialHealthPillar[]): string {
  const critical = pillars.filter((p) => p.state === 'critical');
  const inconclusive = pillars.filter((p) => p.state === 'inconclusive');
  const hasCriticalBase = pillars.some(
    (p) => (p.id === 'liquidity' || p.id === 'flow') && p.state === 'critical',
  );

  if (hasCriticalBase) {
    return 'A leitura de capacidade começa pela base: liquidez e/ou fluxo estão críticos — o restante do check-up contextualiza, não substitui esse foco.';
  }
  if (critical.length > 0) {
    return `Há eixos em estado crítico (${critical.map((p) => p.name).join(', ')}). A capacidade do sistema pede lucidez nesses pontos antes de ampliar o horizonte.`;
  }
  if (inconclusive.length >= 3) {
    return 'Parte relevante da capacidade ainda está inconclusiva — o check-up mostra o que já é legível e declara as lacunas sem inventar certeza.';
  }
  return 'O check-up descreve a capacidade atual do sistema por pilares. Não substitui o parecer do dia na Home nem um laudo completo.';
}

export function mapLiveMetricsToPillars(input: LiveMetricsInput): FinancialHealthCheckup {
  const byId: Record<PillarId, FinancialHealthPillar> = {
    liquidity: buildLiquidity(input.indebtedness),
    flow: buildFlow(input.summary),
    structure: buildStructure(input.indebtedness),
    credit: buildCredit(input.indebtedness),
    resilience: buildResilience(input.indebtedness, input.summary),
    wealth: buildWealth(input.indebtedness),
  };

  const pillars = PILLAR_ORDER.map((id) => byId[id]);
  const hasCriticalBase = pillars.some(
    (p) => (p.id === 'liquidity' || p.id === 'flow') && p.state === 'critical',
  );

  return {
    surfaceQuestion: 'Qual é a capacidade financeira do meu sistema?',
    pillars,
    closingSynthesis: buildClosingSynthesis(pillars),
    hasCriticalBase,
  };
}
