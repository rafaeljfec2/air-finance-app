import { Link2, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const STEPS = [
  {
    icon: Link2,
    number: '01',
    title: 'Conectar',
    description: 'Traga seus dados financeiros — de forma segura e no seu ritmo.',
  },
  {
    icon: Compass,
    number: '02',
    title: 'Interpretar',
    description: 'O AirFinance lê o sistema e organiza a capacidade em uma conversa clara.',
  },
  {
    icon: Lightbulb,
    number: '03',
    title: 'Compreender',
    description: 'Você vê o que sustenta e o que merece atenção — sem score nem culpa.',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Melhores decisões',
    description: 'Com menos incerteza, a próxima decisão financeira fica mais simples.',
  },
] as const;

export function HowItWorksV3() {
  return (
    <section id="how-it-works" className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Como funciona</div>
          <h2 className="v3-h2 mb-4">Do dado à decisão</h2>
          <p className="v3-body max-w-xl mx-auto">
            Quatro etapas. Sem lista de features. Sem parede de gráficos.
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
      </div>
    </section>
  );
}
