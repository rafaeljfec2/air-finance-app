import type { Playbook } from './types';

export const highFixedCostPlaybook: Playbook = {
  slug: 'high_fixed_cost',
  title: 'Contas fixas pesando demais',
  explanation:
    'Boa parte do que você paga todo mês é previsível: financiamento, aluguel, escola, planos. Esses compromissos mudam devagar — a folga costuma vir do que você ainda controla no curto prazo.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Separar contrato longo do que dá para revisar em semanas.',
      actions: [
        'Liste fixos com valor e data e marque o que é financiamento, aluguel ou contrato longo',
        'Marque o que tem ciclo curto (internet, streaming, academia, seguro) para revisar ou cancelar',
        'Não assuma novos contratos fixos até a margem melhorar',
        'Adie compras parceladas que não são essenciais',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Aumentar folga sem prometer cortes irreais no essencial.',
      actions: [
        'Reduza gastos variáveis (mercado, delivery, lazer) antes de mirar financiamento ou aluguel',
        'Troque ou cancele pelo menos um plano de ciclo curto que você usa pouco',
        'Defina um teto: não criar novo compromisso fixo até sobrar margem confortável',
        'Se pensar em refinanciar casa ou carro, só com simulação e custo total comparado',
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
