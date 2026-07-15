import type { FinancialArchetype, NextJourneyStage } from '@/types/decisionDashboard';

interface JourneyStageDefinition {
  readonly id: NextJourneyStage['id'];
  readonly label: string;
  readonly summary: string;
  readonly reason: string;
}

const NEXT_STAGE_BY_ARCHETYPE: Record<FinancialArchetype, JourneyStageDefinition> = {
  survivor: {
    id: 'see',
    label: 'Enxergar',
    summary: 'Ganhar clareza sobre para onde o dinheiro está indo.',
    reason:
      'Quando o ciclo deixa de ser a única urgência, o próximo horizonte da jornada é compreender o fluxo com honestidade.',
  },
  organizer: {
    id: 'generate_cash',
    label: 'Gerar Caixa',
    summary: 'Criar capacidade financeira sustentável no fluxo.',
    reason:
      'Com clareza estável, o próximo horizonte é melhorar o fluxo e liberar espaço real para escolher.',
  },
  builder: {
    id: 'make_money_work',
    label: 'Fazer o Dinheiro Trabalhar',
    summary: 'Alocar com critério após proteger a base construída.',
    reason:
      'Com base em construção, o próximo horizonte é fazer o dinheiro trabalhar alinhado ao plano — sem pressa.',
  },
  investor: {
    id: 'expand',
    label: 'Expandir a Capacidade Financeira',
    summary: 'Ampliar geração de capacidade sem fragilizar o que foi conquistado.',
    reason:
      'Com o dinheiro trabalhando conforme o plano, o próximo horizonte é expandir capacidade com critério.',
  },
  expander: {
    id: 'expand',
    label: 'Expandir a Capacidade Financeira',
    summary: 'Aprofundar decisões de expansão com a base intacta.',
    reason:
      'Não há estágio acima na jornada; o foco é aprofundar expansão responsável, sem saltos artificiais.',
  },
};

export function resolveNextJourneyStage(
  archetype: FinancialArchetype,
  readyForNext: boolean,
): NextJourneyStage {
  const definition = NEXT_STAGE_BY_ARCHETYPE[archetype];
  const canInvite = readyForNext && archetype !== 'expander';

  return {
    ...definition,
    visibility: canInvite ? 'available' : 'hidden',
  };
}
