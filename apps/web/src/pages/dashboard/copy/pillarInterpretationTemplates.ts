import type { CapacityState, PillarId } from '../types';

interface TemplateBlock {
  readonly interpretation: string;
  readonly improves: readonly string[];
  readonly worsens: readonly string[];
  readonly summarySentence: string;
}

const sharedImproves = {
  liquidity: [
    'Entradas no horizonte curto',
    'Redução de obrigações imediatas',
    'Reconstituição de saldo operacional',
  ],
  flow: [
    'Resultado do período positivo',
    'Margem menos comprimida',
    'Menor vazão relativa à receita',
  ],
  structure: [
    'Menor peso de compromissos sobre a renda',
    'Mais espaço de ajuste no ciclo',
    'Flexibilidade real entre o prometido e o escolhido',
  ],
  credit: [
    'Utilização sob controle',
    'Liquidação no fluxo da conta',
    'Menos dependência estrutural do cartão',
  ],
  resilience: [
    'Maior tempo estimado de caixa',
    'Colchão marcado para imprevistos',
    'Menor pressão recorrente de curto prazo',
  ],
  wealth: [
    'Acúmulo consistente no tempo',
    'Redução de passivos observáveis',
    'Inventário patrimonial mais completo',
  ],
} as const;

const sharedWorsens = {
  liquidity: [
    'Saídas concentradas sem entrada correspondente',
    'Obrigações curtas à frente do caixa',
    'Saldo operacional pressionado',
  ],
  flow: ['Despesas acima da receita do período', 'Margem comprimida', 'Ciclo que não deixa folga'],
  structure: [
    'Compromissos altos sobre a renda',
    'Pouco espaço para ajustar o ciclo',
    'Rigidez que reduz escolha',
  ],
  credit: [
    'Utilização elevada do limite',
    'Crédito carregando o timing do ciclo',
    'Serviço de dívida comprimindo folga',
  ],
  resilience: [
    'Tempo estimado de caixa curto',
    'Ausência de reserva marcada',
    'Choques de curto prazo recorrentes',
  ],
  wealth: [
    'Consumo de base',
    'Passivos crescendo sem inventário claro',
    'Lacuna de visão patrimonial',
  ],
} as const;

function block(interpretation: string, summarySentence: string, pillar: PillarId): TemplateBlock {
  return {
    interpretation,
    improves: sharedImproves[pillar],
    worsens: sharedWorsens[pillar],
    summarySentence,
  };
}

const byPillarState: Record<PillarId, Partial<Record<CapacityState, TemplateBlock>>> = {
  liquidity: {
    excellent: block(
      'O caixa disponível sustenta a operação no horizonte curto com folga observável.',
      'Liquidez folgada — o sistema opera com colchão de curto prazo.',
      'liquidity',
    ),
    good: block(
      'Há liquidez para operar agora; a pressão imediata permanece sob controle.',
      'Liquidez sustentável para o horizonte curto.',
      'liquidity',
    ),
    attention: block(
      'O caixa opera no fio: obrigações curtas competem com o saldo disponível.',
      'Liquidez sob tensão — o curto prazo pede atenção.',
      'liquidity',
    ),
    critical: block(
      'A continuidade de curto prazo está comprometida pelo saldo frente às obrigações.',
      'Liquidez crítica — a capacidade imediata está pressionada.',
      'liquidity',
    ),
    inconclusive: block(
      'Ainda não há dados suficientes para ler a liquidez do sistema com segurança.',
      'Liquidez inconclusiva até haver saldos e obrigações confiáveis.',
      'liquidity',
    ),
  },
  flow: {
    excellent: block(
      'O período gera folga clara: receita operacional cobre o ciclo com sobra.',
      'Fluxo folgado — o ciclo deixa capacidade de escolha.',
      'flow',
    ),
    good: block(
      'O resultado do período é sustentável: o ciclo fecha sem consumir a base.',
      'Fluxo saudável no período observado.',
      'flow',
    ),
    attention: block(
      'A folga do ciclo é frágil: o resultado está no limite da sustentabilidade.',
      'Fluxo sob tensão — a folga do ciclo é estreita.',
      'flow',
    ),
    critical: block(
      'O ciclo não gera folga: despesas superam a receita do período de forma material.',
      'Fluxo crítico — o período não sustenta folga.',
      'flow',
    ),
    inconclusive: block(
      'O resultado do período ainda não pode ser lido com confiança.',
      'Fluxo inconclusivo até haver receita e despesa do período.',
      'flow',
    ),
  },
  structure: {
    excellent: block(
      'Os compromissos sobre a renda deixam espaço amplo de ajuste no ciclo.',
      'Estrutura flexível — há capacidade de adaptar o ciclo.',
      'structure',
    ),
    good: block(
      'A estrutura de compromissos permite ajuste sem engolir toda a escolha.',
      'Estrutura sustentável — rigidez sob controle.',
      'structure',
    ),
    attention: block(
      'Parte relevante da renda já está prometida; o espaço de ajuste encolheu.',
      'Estrutura sob tensão — o ciclo ficou mais rígido.',
      'structure',
    ),
    critical: block(
      'O comprometimento da renda deixa pouca margem real de escolha no ciclo.',
      'Estrutura crítica — pouca flexibilidade observável.',
      'structure',
    ),
    inconclusive: block(
      'Ainda falta sinal confiável de comprometimento para ler a rigidez do sistema.',
      'Estrutura inconclusiva até haver leitura confiável de comprometimento.',
      'structure',
    ),
  },
  credit: {
    excellent: block(
      'A utilização do crédito permanece baixa e compatível com uma ponte ocasional de timing.',
      'Crédito sob controle — ponte, não muleta.',
      'credit',
    ),
    good: block(
      'O crédito está em uso moderado; ainda funciona como instrumento, não como base.',
      'Crédito em uso sustentável no momento.',
      'credit',
    ),
    attention: block(
      'A utilização elevada sugere que o crédito está amortecendo o timing do ciclo.',
      'Crédito sob tensão — a ponte está carregando peso.',
      'credit',
    ),
    critical: block(
      'A utilização crítica indica que o crédito pode estar carregando a continuidade do sistema.',
      'Crédito crítico — risco de muleta estrutural.',
      'credit',
    ),
    inconclusive: block(
      'Não há leitura confiável da utilização de crédito neste contexto.',
      'Crédito inconclusivo até haver limites e utilização.',
      'credit',
    ),
  },
  resilience: {
    excellent: block(
      'O tempo estimado de caixa sugere boa capacidade de absorver choques de curto prazo.',
      'Resiliência folgada no horizonte observável.',
      'resilience',
    ),
    good: block(
      'Há colchão operacional suficiente para absorver oscilações moderadas.',
      'Resiliência sustentável para choques moderados.',
      'resilience',
    ),
    attention: block(
      'O amortecimento é curto: um choque de curto prazo apertaria o sistema.',
      'Resiliência sob tensão — pouco colchão observável.',
      'resilience',
    ),
    critical: block(
      'Há pouca capacidade observável de absorver interrupções sem pressionar o ciclo.',
      'Resiliência crítica — choques curtos encontram o sistema exposto.',
      'resilience',
    ),
    inconclusive: block(
      'Reserva marcada e tempo estimado de caixa ainda não estão disponíveis com segurança.',
      'Resiliência inconclusiva — lacuna de reserva ou tempo de caixa.',
      'resilience',
    ),
  },
  wealth: {
    excellent: block(
      'A posição patrimonial observável aponta base sólida no horizonte longo.',
      'Patrimônio observável robusto — sem confundir com liquidez.',
      'wealth',
    ),
    good: block(
      'Há posição patrimonial legível e estável o suficiente para leitura de longo prazo.',
      'Patrimônio legível e em trajetória sustentável.',
      'wealth',
    ),
    attention: block(
      'A visão patrimonial é parcial ou tensionada — convém não tratar estoque como saúde sozinha.',
      'Patrimônio sob tensão ou inventário incompleto.',
      'wealth',
    ),
    critical: block(
      'Passivos observáveis pressionam a posição patrimonial líquida.',
      'Patrimônio pressionado pelos passivos observáveis.',
      'wealth',
    ),
    inconclusive: block(
      'Inventário de ativos e passivos ainda incompleto para uma leitura patrimonial.',
      'Patrimônio inconclusivo até haver inventário confiável.',
      'wealth',
    ),
  },
};

export function getPillarTemplate(pillarId: PillarId, state: CapacityState): TemplateBlock {
  const pillarTemplates = byPillarState[pillarId];
  const found = pillarTemplates[state];
  if (found) {
    return found;
  }
  return (
    pillarTemplates.inconclusive ??
    block(
      'Leitura ainda incompleta para este pilar.',
      'Pilar inconclusivo neste momento.',
      pillarId,
    )
  );
}
