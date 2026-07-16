import { EyeOff, MessageCircleQuestion, Scale } from 'lucide-react';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const PROBLEMS = [
  {
    icon: EyeOff,
    title: 'Incerteza no lugar da clareza',
    description:
      'Você sente o dinheiro apertar, mas não consegue dizer com lucidez como está a capacidade do seu sistema.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Difícil explicar a alguém',
    description:
      'Se alguém perguntar “como está sua saúde financeira?”, a resposta vira um emaranhado de apps, saldos e impressões.',
  },
  {
    icon: Scale,
    title: 'Números sem decisão',
    description:
      'Planilhas e painéis acumulam dados. O que falta é uma leitura que oriente a próxima decisão — sem culpa nem pressa artificial.',
  },
] as const;

export function ProblemV3() {
  return (
    <section className="v3-section bg-white">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="v3-h2 mb-4">
            Você consegue explicar
            <br className="hidden sm:block" />
            <span className="text-gray-400"> a capacidade do seu sistema?</span>
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            A maioria vive no escuro operacional: dados espalhados, impressões soltas, nenhuma
            leitura que una liquidez, fluxo e o restante em uma conversa humana.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          staggerDelay={0.12}
        >
          {PROBLEMS.map((problem) => {
            const Icon = problem.icon;
            return (
              <StaggerItem key={problem.title}>
                <div className="v3-card text-center group h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{problem.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
