import { EyeOff, MessageCircleQuestion, Scale } from 'lucide-react';

import { HoverLift, ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const PROBLEMS = [
  {
    icon: Scale,
    title: 'Saldo não é capacidade',
    description:
      'Ver o saldo do banco não diz se o sistema aguenta o mês, o imprevisto ou a próxima decisão grande.',
  },
  {
    icon: EyeOff,
    title: 'Gráficos não são decisão',
    description:
      'Planilhas e painéis acumulam números. O que falta é uma leitura que reduza a incerteza — sem culpa.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Difícil explicar a alguém',
    description:
      'Se perguntarem “como está sua saúde financeira?”, a resposta vira apps, saldos e impressões soltas.',
  },
] as const;

export function ProblemV3() {
  return (
    <section className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="v3-h2 mb-4">
            Você sabe a capacidade
            <br className="hidden sm:block" />
            <span className="text-gray-500"> do seu sistema?</span>
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            A maioria vive no escuro operacional: dados espalhados, impressões soltas, nenhuma
            leitura que una o dinheiro em uma conversa humana.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          staggerDelay={0.1}
        >
          {PROBLEMS.map((problem) => {
            const Icon = problem.icon;
            return (
              <StaggerItem key={problem.title}>
                <HoverLift className="h-full">
                  <div className="v3-card text-center group h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 mb-4 group-hover:bg-emerald-500/25 transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-50 mb-2">{problem.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{problem.description}</p>
                  </div>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
