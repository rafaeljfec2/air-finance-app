import type { Playbook } from './types';

export const debtPressurePlaybook: Playbook = {
  slug: 'debt_pressure',
  title: 'Dívidas pesando na renda',
  explanation:
    'Uma parte grande do que você ganha está indo para pagar dívidas. Sobra pouco para viver e organizar a casa.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Não criar dívida nova e atacar a mais cara.',
      actions: [
        'Pare de criar novas dívidas por enquanto',
        'Liste todas as dívidas com valor, prazo e custo mensal',
        'Foque na dívida mais cara primeiro (cartão e cheque especial primeiro)',
        'Negocie ou troque a mais cara por uma mais barata',
        'Pague mais que o mínimo da fatura sempre que conseguir',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Diminuir o peso da dívida no mês.',
      actions: [
        'Direcione qualquer sobra do mês para quitar a dívida cara',
        'Renegocie prazos ou parcelas quando o custo cair',
        'Mantenha as parcelas dentro de um valor que cabe no orçamento',
        'Evite voltar a usar cheque especial e parcelamento de fatura',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Crédito como ferramenta, não como salvação.',
      actions: [
        'Use crédito só quando souber como vai pagar',
        'Pague a fatura completa todo mês',
        'Mantenha as parcelas em um patamar confortável',
      ],
    },
  },
  rule: 'Dívidas não devem comprometer mais que 25% da sua renda.',
  expectedImpact: 'Você reduz juros e volta a ter espaço para viver e poupar.',
};
