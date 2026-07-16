import { Link2, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const STEPS = [
  {
    icon: Link2,
    number: '01',
    title: 'Trazer seus dados',
    description:
      'Você conecta o que precisa — no seu ritmo. Conexões bancárias são um meio, não o produto.',
  },
  {
    icon: Compass,
    number: '02',
    title: 'Receber o Check-up',
    description: 'Você passa a ver como as partes do sistema se relacionam até a capacidade.',
  },
  {
    icon: Lightbulb,
    number: '03',
    title: 'Compreender o essencial',
    description: 'Você entende o que sustenta e o que merece atenção — sem score.',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Decidir com clareza',
    description: 'Você escolhe o próximo passo com menos incerteza.',
  },
] as const;

export function HowItWorksV3() {
  return (
    <section id="how-it-works" className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Como funciona</div>
          <h2 className="v3-h2 mb-4">Do primeiro passo ao Check-up</h2>
          <p className="v3-body max-w-xl mx-auto">
            Quatro etapas até a compreensão. Sem lista de recursos — só o caminho da descoberta.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.12}
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.title}>
                <div className="relative text-center h-full">
                  {index < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gray-800" />
                  )}

                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-gray-800 bg-[var(--v3-bg-alt)] mb-5">
                    <Icon className="w-7 h-7 text-emerald-400" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.number.replace('0', '')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-50 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <ScrollReveal className="text-center mt-10" delay={0.15}>
          <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
            Open Finance e inteligência artificial entram como infraestrutura para reunir e
            organizar dados — o protagonismo é a interpretação do seu sistema.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
