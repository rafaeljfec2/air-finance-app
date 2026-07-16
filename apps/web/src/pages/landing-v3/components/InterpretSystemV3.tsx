import { BookOpen, Compass, Shield } from 'lucide-react';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const POINTS = [
  {
    icon: Compass,
    title: 'Você passa a ver o sistema inteiro',
    description:
      'Em vez de se perder em métricas, você entende o que sustenta e o que merece atenção.',
  },
  {
    icon: BookOpen,
    title: 'Você aprofunda no seu ritmo',
    description:
      'Primeiro a compreensão do conjunto. Depois o detalhe — só quando você escolhe ir mais longe.',
  },
  {
    icon: Shield,
    title: 'Você decide com honestidade',
    description:
      'Capacidade e lacunas ficam claras. Sem pressão artificial — a decisão continua sendo sua.',
  },
] as const;

export function InterpretSystemV3() {
  return (
    <section id="interpret-system" className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Compreensão</div>
          <h2 className="v3-h2 mb-4">
            Você finalmente consegue
            <br className="hidden sm:block" />
            explicar a capacidade do seu sistema
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            Com o AirFinance você passa a entender, interpretar e explorar — nessa ordem. Não é
            acumular números em uma tela lotada.
          </p>
        </ScrollReveal>

        <StaggerContainer className="max-w-3xl mx-auto space-y-4" staggerDelay={0.1}>
          {POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <StaggerItem key={point.title}>
                <div className="group flex gap-4 items-start rounded-2xl border border-gray-800 bg-[var(--v3-bg-alt)] p-5 md:p-6 transition-colors duration-200 hover:border-emerald-500/35">
                  <div className="shrink-0 flex flex-col items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </span>
                    {index < POINTS.length - 1 ? (
                      <span className="mt-2 hidden h-6 w-px bg-gray-800 md:block" aria-hidden />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-50 mb-1">{point.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
