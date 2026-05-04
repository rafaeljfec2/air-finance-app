import type { Playbook } from './types';

export const lowSavingsPlaybook: Playbook = {
  slug: 'low_savings',
  title: 'Está guardando pouco',
  explanation:
    'Você está conseguindo pagar as contas, mas quase nada está indo para o futuro ou para emergências.',
  phases: {
    red: {
      headline: 'Pare de piorar',
      objective: 'Começar a guardar algo, mesmo que pequeno.',
      actions: [
        'Comece guardando um valor pequeno todo mês (ex.: R$ 50)',
        'Pague-se primeiro: separe assim que receber, antes de gastar',
        'Use uma conta separada só para a reserva',
        'Não mexa nessa reserva para gastos do dia a dia',
      ],
    },
    yellow: {
      headline: 'Voltando a respirar',
      objective: 'Construir uma reserva inicial.',
      actions: [
        'Suba o valor guardado aos poucos (ex.: 1% da renda por mês)',
        'Mire em uma reserva de pelo menos um mês de despesas',
        'Aproveite mês com 3 salários (13º, férias) para reforçar a reserva',
        'Automatize a transferência para a reserva',
      ],
    },
    green: {
      headline: 'Mantendo no verde',
      objective: 'Guardar com regra e sem perder qualidade de vida.',
      actions: [
        'Guarde uma fatia fixa da renda todo mês',
        'Mantenha a reserva equivalente a 3 a 6 meses de despesas',
        'Revise objetivos de longo prazo (casa, carro, viagem) duas vezes por ano',
      ],
    },
  },
  rule: 'Guardar uma parte da renda todo mês, antes de qualquer gasto.',
  expectedImpact: 'Você ganha tranquilidade para imprevistos e começa a realizar objetivos.',
};
