export const COMPLETE_PLAN_LABELS = {
  sectionTitle: 'Seu plano completo',
  sectionDescription: 'Tudo que está acontecendo, o que mudar e como continuar no controle.',
  diagnosisTitle: 'O que está acontecendo',
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
  installmentsEmpty: 'Você não tem parcelas ativas no momento.',
  behaviorTitle: 'Seu comportamento',
  topCategoriesTitle: 'Onde você mais gasta',
  peakDaysTitle: 'Dias que pesam mais no orçamento',
  peakDaysEmpty: 'Não identificamos dias de pico neste mês.',
  rulesTitle: 'Regras para você seguir',
  simpleRuleTitle: 'Regra simples para lembrar',
  outcomeTitle: 'O que muda se você seguir o plano',
  loading: 'Carregando seu plano…',
  error: 'Não foi possível carregar seu plano',
  retry: 'Tentar de novo',
  cachedHint: 'Texto reaproveitado da última análise.',
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
