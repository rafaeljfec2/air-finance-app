import { EyeOff, MessageCircleQuestion, Scale } from 'lucide-react';

import { HoverLift, ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const PROBLEMS = [
  {
    icon: Scale,
    title: 'Saldo não é capacidade',
    description:
      'Você vê quanto tem na conta — e ainda assim não sabe se o mês fecha, se o imprevisto cabe ou se a decisão grande é segura.',
  },
  {
    icon: EyeOff,
    title: 'Incerteza no lugar da clareza',
    description:
      'Você sente o dinheiro apertar, mas não consegue explicar com lucidez como está a sua vida financeira.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Sem uma leitura que una tudo',
    description:
      'Apps e planilhas acumulam impressões. Você ainda não tem uma conversa clara sobre o seu dinheiro.',
  },
] as const;

export function ProblemV3() {
  return (
    <section className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="v3-h2 mb-4">
            Você consegue explicar
            <br className="hidden sm:block" />
            <span className="text-gray-500"> como está o seu dinheiro?</span>
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            O problema não é falta de aplicativo. É viver sem clareza sobre a própria capacidade
            financeira — e decidir no escuro.
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
