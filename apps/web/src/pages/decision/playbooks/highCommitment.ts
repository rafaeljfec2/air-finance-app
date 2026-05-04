import type { Playbook } from './types';

export const highCommitmentPlaybook: Playbook = {
  slug: 'high_commitment',
  title: 'Quase toda a renda já tem dono',
  explanation:
    'Antes do mês começar, boa parte do que você ganha já está prometida para parcelas, contas fixas e compromissos. Sobra pouca margem.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Não somar novos compromissos no orçamento.',
      actions: [
        'Não crie novas parcelas por enquanto',
        'Liste todas as parcelas e contas fixas que você já tem',
        'Veja quanto da sua renda já está comprometida hoje',
        'Adie compras grandes parceladas',
        'Quite ou antecipe a parcela menor para liberar espaço logo',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Abrir espaço no orçamento.',
      actions: [
        'Defina um teto seguro para parcelas (ex.: até 25% da renda)',
        'Espere parcelas antigas terminarem antes de iniciar novas',
        'Planeje compras maiores antes de parcelar',
        'Evite renovar contratos e assinaturas no automático',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Comprar parcelado com regra, sem sufoco.',
      actions: [
        'Você pode parcelar, mas dentro do seu teto',
        'Evite ter muitas parcelas grandes ao mesmo tempo',
        'Prefira parcelar só compras importantes e duradouras',
      ],
    },
  },
  rule: 'Nunca comprometer mais de 25% da renda com parcelas.',
  expectedImpact: 'Você volta a ter controle e evita apertos no fim do mês.',
};
