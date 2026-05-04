import type { Playbook } from './types';

export const lowSurplusPlaybook: Playbook = {
  slug: 'low_surplus',
  title: 'Sobra pouco no mês',
  explanation:
    'Você está gastando praticamente tudo o que ganha. Não sobra dinheiro para imprevistos nem para os seus objetivos.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Cortar o que não é essencial agora.',
      actions: [
        'Corte os gastos não essenciais por algumas semanas',
        'Evite compras por impulso até organizar o caixa',
        'Foque o gasto só no necessário (casa, comida, transporte, contas)',
        'Identifique pelo menos 3 gastos pequenos e recorrentes para pausar',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Recuperar uma sobra mínima todo mês.',
      actions: [
        'Defina um valor mínimo para guardar todo mês',
        'Reduza gastos pequenos repetidos (delivery, app, lanchonete)',
        'Revise assinaturas e cancele as que não usa há 30 dias',
        'Revise as contas de casa para encontrar economia (luz, internet)',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Sobrar dinheiro com naturalidade.',
      actions: [
        'Guarde uma parte da renda assim que receber',
        'Use a sobra com consciência, sem culpa',
        'Planeje gastos maiores com antecedência',
      ],
    },
  },
  rule: 'Sempre guardar pelo menos 10% da renda no início do mês.',
  expectedImpact: 'Você passa a ter dinheiro sobrando e mais segurança no dia a dia.',
};
