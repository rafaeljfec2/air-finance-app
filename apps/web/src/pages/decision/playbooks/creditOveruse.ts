import type { Playbook } from './types';

export const creditOverusePlaybook: Playbook = {
  slug: 'credit_overuse',
  title: 'Cartão muito perto do limite',
  explanation:
    'Você está usando uma fatia grande do limite. Isso aperta o caixa do próximo mês e aumenta o risco de dívida.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Travar o uso do cartão até o limite respirar.',
      actions: [
        'Pare de usar o cartão por algumas semanas',
        'Use só débito ou dinheiro nesse período',
        'Pague mais que o mínimo da próxima fatura',
        'Cancele compras parceladas pendentes que ainda dá para desfazer',
        'Tire o cartão de carteiras digitais e sites de compra recorrente',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Manter o uso abaixo da metade do limite.',
      actions: [
        'Mire em usar no máximo metade do limite total',
        'Concentre o uso em um único cartão principal',
        'Evite cartão para gastos do dia a dia (mercado, app, lanchonete)',
        'Acompanhe a fatura aberta uma vez por semana',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Cartão como ferramenta, com regra clara.',
      actions: [
        'Use cartão com planejamento, não para complementar a renda',
        'Pague sempre o valor total da fatura',
        'Reserve o limite para emergências e compras importantes',
      ],
    },
  },
  rule: 'Não usar mais de 30% a 40% do limite total do cartão.',
  expectedImpact: 'Você evita entrar em dívida cara e mantém o cartão como aliado.',
};
