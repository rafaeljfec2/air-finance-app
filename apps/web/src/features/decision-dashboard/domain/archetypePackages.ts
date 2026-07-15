import type {
  ActionOfTheDay,
  DecisionCard,
  DecisionDashboardSignals,
  DecisionInsight,
  FinancialArchetype,
} from '@/types/decisionDashboard';

interface ArchetypePackage {
  readonly question: string;
  readonly buildStatus: (signals: DecisionDashboardSignals) => string;
  readonly buildPriorityCards: (
    signals: DecisionDashboardSignals,
    actionId: string,
  ) => DecisionCard[];
  readonly buildSecondaryCards: (signals: DecisionDashboardSignals) => DecisionCard[];
  readonly buildInsight: (signals: DecisionDashboardSignals) => DecisionInsight | undefined;
  readonly buildAction: (signals: DecisionDashboardSignals) => ActionOfTheDay;
  readonly buildCaptureAction: () => ActionOfTheDay;
}

function captureAction(
  archetype: FinancialArchetype,
  label: string,
  rationale: string,
): ActionOfTheDay {
  return {
    id: `capture-${archetype}`,
    label,
    rationale,
    archetype,
    urgency: 'today',
    completion_hint: 'Essential cycle information is registered',
  };
}

function card(
  code: string,
  title: string,
  summary: string,
  supportsActionId: string,
  visibility: DecisionCard['visibility'] = 'priority',
): DecisionCard {
  return { code, title, summary, supports_action_id: supportsActionId, visibility };
}

function hasCashflowEvidence(signals: DecisionDashboardSignals): boolean {
  return signals.income > 0 || signals.expenses > 0;
}

const SURVIVOR_PACKAGE: ArchetypePackage = {
  question: 'Vou conseguir fechar este mês?',
  buildStatus: (signals) => {
    if (!signals.hasPayables && !signals.hasReceivables) {
      return 'Ainda não há dados suficientes para responder se o ciclo fecha.';
    }
    if (signals.enginePrimaryIssue === 'liquidity_risk' || signals.balance < 0) {
      return 'O ciclo está em risco — há pressão de saídas sobre a capacidade atual.';
    }
    if (
      hasCashflowEvidence(signals) &&
      signals.balance >= 0 &&
      signals.income >= signals.expenses
    ) {
      return 'Com os dados atuais, o ciclo parece sob controle.';
    }
    return 'A leitura do ciclo ainda é parcial — o essencial já aponta o próximo gesto.';
  },
  buildPriorityCards: (signals, actionId) => {
    const cards: DecisionCard[] = [
      card(
        'S2',
        'Saídas críticas próximas',
        signals.hasPayables
          ? 'Há compromissos a pagar que pressionam o ciclo.'
          : 'Ainda faltam as próximas saídas críticas do ciclo.',
        actionId,
      ),
      card(
        'S3',
        'Entradas esperadas',
        signals.hasReceivables
          ? 'Há entradas previstas que podem aliviar o ciclo.'
          : 'Registre entradas esperadas para decidir com mais segurança.',
        actionId,
      ),
    ];
    if (signals.hasCreditPressure) {
      cards.push(
        card(
          'S4',
          'Pressão de crédito',
          'O cartão/crédito aumenta a pressão sobre o fechamento do ciclo.',
          actionId,
        ),
      );
    }
    return cards.slice(0, 3);
  },
  buildSecondaryCards: () => [
    card(
      'S-sec-1',
      'Movimentos recentes',
      'Poucos movimentos recentes sob demanda.',
      'none',
      'secondary',
    ),
  ],
  buildInsight: (signals) => {
    if (signals.engineOrderingRationale) {
      return { id: 'survivor-insight', message: signals.engineOrderingRationale };
    }
    if (
      hasCashflowEvidence(signals) &&
      signals.balance >= 0 &&
      signals.income >= signals.expenses
    ) {
      return {
        id: 'survivor-insight',
        message:
          'O ciclo parece sob controle — o foco agora é um gesto que preserve essa estabilidade.',
      };
    }
    if (!hasCashflowEvidence(signals) && (signals.hasPayables || signals.hasReceivables)) {
      return {
        id: 'survivor-insight',
        message:
          'Há compromissos no ciclo, mas ainda falta evidência de entradas e saídas para confirmar o fechamento.',
      };
    }
    return {
      id: 'survivor-insight',
      message: 'Há risco de apertar o ciclo — o gesto de hoje é o que mais protege o fechamento.',
    };
  },
  buildAction: (signals) => ({
    id: 'survivor-action',
    label: signals.engineActionTitle ?? 'Proteger o ciclo com um único gesto hoje',
    rationale:
      signals.engineActionDescription ??
      'Concentre energia no que mais reduz o risco de não fechar o mês.',
    archetype: 'survivor',
    urgency: 'today',
  }),
  buildCaptureAction: () =>
    captureAction(
      'survivor',
      'Registrar o mínimo do ciclo (saídas e entradas críticas)',
      'Sem compromissos e entradas, não dá para responder se o mês fecha.',
    ),
};

const ORGANIZER_PACKAGE: ArchetypePackage = {
  question: 'Para onde meu dinheiro está indo?',
  buildStatus: (signals) => {
    if (signals.topExpenseLabel) {
      return `O padrão que mais importa agora aponta para ${signals.topExpenseLabel}.`;
    }
    return 'A clareza dos destinos ainda está se formando — um ajuste consciente já é possível.';
  },
  buildPriorityCards: (signals, actionId) =>
    [
      card(
        'O1',
        'Destinos principais',
        signals.topExpenseLabel
          ? `Destino em evidência agora: ${signals.topExpenseLabel}.`
          : 'Identifique os poucos destinos que mais importam neste ciclo.',
        actionId,
      ),
      card(
        'O2',
        'Comprometido vs escolha',
        'Separe o que já está comprometido do que ainda é escolha consciente.',
        actionId,
      ),
      card(
        'O3',
        'Espaço de capacidade',
        signals.income > signals.expenses
          ? 'Há espaço de capacidade neste fluxo.'
          : 'A capacidade do fluxo merece um ajuste agora.',
        actionId,
      ),
    ].slice(0, 3),
  buildSecondaryCards: () => [
    card(
      'O-sec-1',
      'Contas resumidas',
      'Visão resumida de contas sob demanda.',
      'none',
      'secondary',
    ),
  ],
  buildInsight: (signals) => ({
    id: 'organizer-insight',
    message: signals.topExpenseLabel
      ? `O padrão que mais importa agora é ${signals.topExpenseLabel} — ajuste sem culpa.`
      : 'O padrão que mais importa agora é o destino que mais drena capacidade.',
  }),
  buildAction: (signals) => ({
    id: 'organizer-action',
    label: signals.engineActionTitle ?? 'Fazer um ajuste de clareza ou capacidade',
    rationale:
      signals.engineActionDescription ??
      'Um único ajuste consciente reduz incerteza sobre para onde o dinheiro vai.',
    archetype: 'organizer',
    urgency: 'today',
  }),
  buildCaptureAction: () =>
    captureAction(
      'organizer',
      'Registrar os primeiros movimentos para ver os destinos',
      'Sem movimentos, não dá para responder para onde o dinheiro está indo.',
    ),
};

const BUILDER_PACKAGE: ArchetypePackage = {
  question: 'Estou realmente construindo meu futuro?',
  buildStatus: () => 'A construção depende de proteger o ciclo e avançar a base com consistência.',
  buildPriorityCards: (_signals, actionId) =>
    [
      card(
        'C1',
        'Progresso de construção',
        'Acompanhe a reserva ou objetivo prioritário.',
        actionId,
      ),
      card(
        'C2',
        'Ciclo protegido?',
        'A construção só sustenta se o ciclo continuar protegido.',
        actionId,
      ),
      card('C3', 'Trajetória', 'Evolução como caminho — sem nota punitiva.', actionId),
    ].slice(0, 3),
  buildSecondaryCards: () => [],
  buildInsight: () => ({
    id: 'builder-insight',
    message: 'Progresso real vem de gestos sustentáveis no plano — não de esforço esporádico.',
  }),
  buildAction: (signals) => ({
    id: 'builder-action',
    label: signals.engineActionTitle ?? 'Avançar a meta prioritária ou proteger o ciclo',
    rationale:
      signals.engineActionDescription ??
      'Hoje o gesto é construir base ou proteger o que torna a base possível.',
    archetype: 'builder',
    urgency: 'this_cycle',
  }),
  buildCaptureAction: () =>
    captureAction(
      'builder',
      'Completar o mínimo para ver progresso de construção',
      'Faltam dados para apoiar a decisão de construção.',
    ),
};

const INVESTOR_PACKAGE: ArchetypePackage = {
  question: 'Meu dinheiro está trabalhando por mim?',
  buildStatus: () => 'A pergunta é aderência ao plano e preservação da base — não impulso.',
  buildPriorityCards: (_signals, actionId) =>
    [
      card('I1', 'Aderência ao plano', 'Plano versus impulso na decisão atual.', actionId),
      card(
        'I2',
        'Estado da base',
        'Reserva e estabilidade precisam permanecer intactas.',
        actionId,
      ),
      card(
        'I4',
        'Desvio que exige decisão',
        'Só o desvio relevante pede correção consciente.',
        actionId,
      ),
    ].slice(0, 3),
  buildSecondaryCards: () => [],
  buildInsight: () => ({
    id: 'investor-insight',
    message:
      'Conforme o plano ou fora dele — o que decidir é manter, corrigir ou não agir por impulso.',
  }),
  buildAction: (signals) => ({
    id: 'investor-action',
    label: signals.engineActionTitle ?? 'Manter o plano ou corrigir um desvio consciente',
    rationale:
      signals.engineActionDescription ??
      'A melhor ação pode ser não agir por impulso quando a base está preservada.',
    archetype: 'investor',
    urgency: 'today',
  }),
  buildCaptureAction: () =>
    captureAction(
      'investor',
      'Completar visão mínima da base e do plano',
      'Sem base legível, a decisão de alocação fica frágil.',
    ),
};

const EXPANDER_PACKAGE: ArchetypePackage = {
  question: 'Como posso aumentar minha geração de riqueza?',
  buildStatus: () => 'Expandir com critério — ou pausar — mantendo a base intacta.',
  buildPriorityCards: (_signals, actionId) =>
    [
      card('E1', 'Fontes de geração', 'O que realmente aumenta capacidade agora.', actionId),
      card(
        'E2',
        'Clareza por contexto',
        'Evite misturar contextos na decisão de expansão.',
        actionId,
      ),
      card('E4', 'Base preservada', 'A expansão só faz sentido com a base protegida.', actionId),
    ].slice(0, 3),
  buildSecondaryCards: () => [],
  buildInsight: () => ({
    id: 'expander-insight',
    message: 'Capacidade real versus só movimento — a decisão é avançar, separar ou pausar.',
  }),
  buildAction: (signals) => ({
    id: 'expander-action',
    label: signals.engineActionTitle ?? 'Avançar, separar contexto ou pausar com a base intacta',
    rationale:
      signals.engineActionDescription ??
      'Expandir sem critério fragiliza o que já foi conquistado.',
    archetype: 'expander',
    urgency: 'this_cycle',
  }),
  buildCaptureAction: () =>
    captureAction(
      'expander',
      'Completar visão das fontes e da base',
      'Sem fontes e base claras, expansão vira ruído.',
    ),
};

export const ARCHETYPE_PACKAGES: Record<FinancialArchetype, ArchetypePackage> = {
  survivor: SURVIVOR_PACKAGE,
  organizer: ORGANIZER_PACKAGE,
  builder: BUILDER_PACKAGE,
  investor: INVESTOR_PACKAGE,
  expander: EXPANDER_PACKAGE,
};
