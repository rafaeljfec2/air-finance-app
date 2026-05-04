import type { Playbook } from './types';

export const dataIncompletePlaybook: Playbook = {
  slug: 'data_incomplete',
  title: 'Faltam dados para te ajudar direito',
  explanation:
    'Sem informações suficientes, qualquer recomendação vira chute. Complete os dados básicos para o app entender sua situação.',
  phases: {
    red: {
      headline: 'Comece pelo essencial',
      objective: 'Dar os primeiros passos para o app entender sua casa.',
      actions: [
        'Cadastre suas principais contas e cartões',
        'Informe sua renda mensal',
        'Marque o limite total dos cartões',
        'Classifique receitas e despesas dos últimos 30 dias',
      ],
    },
    yellow: {
      headline: 'Faltam alguns ajustes',
      objective: 'Completar lacunas para o diagnóstico ficar preciso.',
      actions: [
        'Confira saldos das contas',
        'Vincule transações ainda sem categoria',
        'Adicione contas fixas recorrentes',
      ],
    },
    green: {
      headline: 'Quase pronto',
      objective: 'Manter os dados em dia para o diagnóstico evoluir.',
      actions: [
        'Atualize lançamentos toda semana',
        'Revise categorias uma vez por mês',
        'Mantenha cartões e contas conectados em dia',
      ],
    },
  },
  rule: 'Manter contas, cartões e renda atualizados para o diagnóstico funcionar.',
  expectedImpact: 'Com dados completos, o app passa a indicar o que fazer com clareza.',
};
