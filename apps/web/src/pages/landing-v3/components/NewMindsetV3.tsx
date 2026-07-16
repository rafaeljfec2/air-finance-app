import { BarChart3, Layers, Sparkles } from 'lucide-react';

import { HoverLift, ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const IDEAS = [
  {
    icon: BarChart3,
    title: 'Mais gráficos não bastam',
    description:
      'Você já viu o que aconteceu no mês. Quase nunca ouviu se o sistema aguenta a próxima decisão.',
  },
  {
    icon: Layers,
    title: 'Mais dados não trazem clareza',
    description:
      'Saldos, categorias e extratos aumentam a informação — e a incerteza continua no mesmo lugar.',
  },
  {
    icon: Sparkles,
    title: 'O que muda é a compreensão',
    description:
      'Você finalmente consegue transformar números em uma conversa clara sobre capacidade e o que merece atenção.',
  },
] as const;

export function NewMindsetV3() {
  return (
    <section id="new-mindset" className="v3-section bg-[var(--v3-bg-alt)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Nova forma de pensar</div>
          <h2 className="v3-h2 mb-4">
            Ver números não é o mesmo
            <br className="hidden sm:block" />
            <span className="text-gray-500"> que entender o seu sistema.</span>
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            Organizar dados ajuda. O salto acontece quando você passa a compreender a capacidade
            financeira — e decide com menos incerteza.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          staggerDelay={0.1}
        >
          {IDEAS.map((idea) => {
            const Icon = idea.icon;
            return (
              <StaggerItem key={idea.title}>
                <HoverLift className="h-full">
                  <div className="v3-card text-center group h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 mb-4 group-hover:bg-emerald-500/25 transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-50 mb-2">{idea.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{idea.description}</p>
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
