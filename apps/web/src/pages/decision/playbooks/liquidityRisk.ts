import type { Playbook } from './types';

export const liquidityRiskPlaybook: Playbook = {
  slug: 'liquidity_risk',
  title: 'O caixa está apertado',
  explanation:
    'Está sobrando pouco (ou nada) entre o que entra e o que sai. Se vier um imprevisto, falta dinheiro.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Manter o dinheiro de pé até o próximo recebimento.',
      actions: [
        'Liste todos os pagamentos dos próximos 7 dias e marque os essenciais',
        'Adie tudo que não for essencial (assinatura, lazer, compras)',
        'Use só débito ou dinheiro até virar o mês',
        'Negocie um prazo maior em pelo menos uma conta grande',
        'Recolha valores parados na sua conta corrente para uso imediato',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Criar uma folga mínima para o mês.',
      actions: [
        'Defina um valor de folga mínimo por mês (ex.: 5% da renda)',
        'Concentre boletos para uma única semana, depois do salário',
        'Cancele assinaturas que você não usou nos últimos 30 dias',
        'Antecipe contas só quando sobrar caixa de verdade',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Manter folga consistente e prever surpresas.',
      actions: [
        'Mantenha pelo menos uma reserva de uma semana de despesas',
        'Revise o caixa toda semana, no mesmo dia',
        'Use cartão só quando souber que paga inteiro',
      ],
    },
  },
  rule: 'Nunca deixar o caixa do mês fechar sem uma folga mínima.',
  expectedImpact: 'Você para de viver no susto e ganha previsibilidade no fim do mês.',
};
