export const COMPLETE_PLAN_LABELS = {
  sectionTitle: 'Seu plano completo',
  sectionDescription: 'Tudo que está acontecendo, o que mudar e como continuar no controle.',
  diagnosisTitle: 'O que está acontecendo',
  coherenceTitle: 'Leitura dos números',
  numbersTitle: 'Sua situação em números',
  numbersToday: 'Hoje você compromete',
  numbersHealthy: 'Meta saudável',
  numbersReduce: 'Para chegar na meta, reduza',
  numbersCompositionLegend:
    'Considera parcelas mensais ativas + juros estimados do cartão (rotativo) + cheque especial.',
  projectionTitle: 'O que muda nos próximos 90 dias',
  projection30: 'Em 30 dias',
  projection60: 'Em 60 dias',
  projection90: 'Em 90 dias',
  installmentsTitle: 'Suas parcelas e por onde começar',
  installmentsCollapsedHint: 'Inclui prioridade baixa e demais parcelas.',
  installmentsEmpty: 'Você não tem parcelas ativas no momento.',
  behaviorTitle: 'Seu comportamento',
  variableSpendingSummaryTitle: 'Resumo do gasto variável',
  variableSpendingSummaryHint:
    'Despesas marcadas como não fixas e que não repetem todo mês — mesmo critério da página inicial.',
  variableSpendingOpenDetail: 'Ver no plano detalhado',
  variableSpendingCardTitle: 'Gastos variáveis',
  variableSpendingVsIncome: 'da sua renda neste mês',
  variableSpendingCardIncomeRowLabel: 'Parte da renda neste mês',
  variableSpendingMomLabel: 'vs mês anterior',
  variableSpendingMomUnavailable: 'Sem comparação com o mês anterior.',
  variableSpendingTopCategoriesTitle: 'Onde cortar primeiro',
  variableSpendingPeakDaysTitle: 'Dias com mais gasto variável',
  variableSpendingFootnote:
    'Classificação baseada no tipo da transação no app (fixa ou variável e se repete todo mês).',
  variableSpendingBucketHealthy: 'Equilibrado',
  variableSpendingBucketAttention: 'Pediu atenção',
  variableSpendingBucketCritical: 'Precisa de foco',
  topCategoriesTitle: 'Onde você mais gasta',
  peakDaysTitle: 'Dias que pesam mais no orçamento',
  peakDaysEmpty: 'Não identificamos dias de pico neste mês.',
  rulesTitle: 'Regras para você seguir',
  simpleRuleTitle: 'Regra simples para lembrar',
  outcomeTitle: 'O que muda se você seguir o plano',
  planDetailsSummary: 'Ver detalhes do plano',
  planDetailsHint: 'Projeção, parcelas, comportamento e regras.',
  loading: 'Carregando seu plano…',
  error: 'Não foi possível carregar seu plano',
  retry: 'Tentar de novo',
} as const;

export const PRIORITY_LABEL_PT: Readonly<Record<'high' | 'medium' | 'low', string>> = {
  high: 'Prioridade alta',
  medium: 'Prioridade média',
  low: 'Prioridade baixa',
};

export const ACCOUNT_TYPE_LABEL_PT: Readonly<Record<'credit_card' | 'other', string>> = {
  credit_card: 'Cartão de crédito',
  other: 'Outra conta',
};

export function installmentsCollapsedSummaryLabel(count: number): string {
  return count === 1 ? 'Ver mais 1 parcela' : `Ver mais ${count} parcelas`;
}
