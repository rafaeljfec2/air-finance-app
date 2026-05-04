import type { Playbook } from './types';

export const healthyPlaybook: Playbook = {
  slug: 'healthy',
  title: 'Está tudo no controle',
  explanation:
    'Suas contas estão organizadas e seu orçamento está saudável. O foco agora é manter esse ritmo e fortalecer o que já está bom.',
  phases: {
    red: {
      headline: 'Se algo apertar de novo',
      objective: 'Reagir rápido sem desorganizar tudo.',
      actions: [
        'Pare de gastar com o que não é essencial por algumas semanas',
        'Revise compras parceladas e contratos novos',
        'Use a reserva, mas marque para repor depois',
      ],
    },
    yellow: {
      headline: 'Se entrar em ajuste',
      objective: 'Voltar ao verde com pequenos ajustes.',
      actions: [
        'Revise os gastos do mês e veja onde gastou mais que o normal',
        'Recoloque a transferência da reserva no automático',
        'Reorganize as contas para o salário do próximo mês',
      ],
    },
    green: {
      headline: 'Mantendo o ritmo bom',
      objective: 'Continuar saudável de forma natural.',
      actions: [
        'Guarde uma fatia fixa da renda todo mês',
        'Revise contas e assinaturas a cada três meses',
        'Aproveite para realizar objetivos sem comprometer o equilíbrio',
      ],
    },
  },
  rule: 'Manter a sobra mensal e revisar o orçamento a cada três meses.',
  expectedImpact: 'Você mantém o controle e avança no que importa, sem sustos.',
};
