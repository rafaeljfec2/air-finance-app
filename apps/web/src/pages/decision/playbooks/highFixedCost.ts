import type { Playbook } from './types';

export const highFixedCostPlaybook: Playbook = {
  slug: 'high_fixed_cost',
  title: 'Contas fixas pesando demais',
  explanation:
    'Boa parte do seu mês já está comprometida com contas fixas (aluguel, escola, plano, contrato). Sobra pouco espaço para ajustar.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Mapear e renegociar o que é grande.',
      actions: [
        'Liste todas as contas fixas com valor e vencimento',
        'Marque as que você pode renegociar agora (plano, internet, escola)',
        'Cancele contratos de baixo uso',
        'Adie qualquer novo contrato fixo até ter folga',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Reduzir o peso das contas fixas.',
      actions: [
        'Renegocie pelo menos uma conta fixa grande',
        'Troque planos caros por opções mais baratas com função parecida',
        'Defina um teto para contas fixas (ex.: até 50% da renda)',
        'Antes de assinar algo novo, verifique se cabe nesse teto',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Compromissos fixos sob controle.',
      actions: [
        'Revise as contas fixas a cada 6 meses',
        'Mantenha equilíbrio entre contas fixas e gastos do dia a dia',
        'Antes de assumir novo contrato, simule o impacto no orçamento',
      ],
    },
  },
  rule: 'Contas fixas não devem ultrapassar 50% da renda.',
  expectedImpact: 'Você ganha espaço para imprevistos, lazer e poupança.',
};
