import { BookOpen, Layers, Shield } from 'lucide-react';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const POINTS = [
  {
    icon: Layers,
    title: 'Lê o sistema por pilares',
    description:
      'Liquidez, fluxo, estrutura, crédito, resiliência e patrimônio — na ordem em que a capacidade se compreende.',
  },
  {
    icon: BookOpen,
    title: 'Revela em camadas',
    description:
      'Primeiro o resumo. Depois cada pilar, escaneável. O detalhe só aparece quando você escolhe explorar.',
  },
  {
    icon: Shield,
    title: 'Aconselha sem decidir por você',
    description:
      'O produto mostra capacidade e lacunas com honestidade. A decisão continua sendo sua — silêncio é o default.',
  },
] as const;

export function InterpretSystemV3() {
  return (
    <section id="interpret-system" className="v3-section bg-[var(--v3-bg-alt)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Leitura</div>
          <h2 className="v3-h2 mb-4">
            Como o AirFinance interpreta
            <br className="hidden sm:block" />
            um sistema financeiro
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            Não é um painel de métricas competindo por atenção. É um check-up conduzido: entender,
            interpretar, explorar — nessa ordem.
          </p>
        </ScrollReveal>

        <StaggerContainer className="max-w-3xl mx-auto space-y-4" staggerDelay={0.1}>
          {POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <StaggerItem key={point.title}>
                <div className="group flex gap-4 items-start rounded-2xl border border-gray-800 bg-[var(--v3-bg)] p-5 md:p-6 transition-colors duration-200 hover:border-emerald-500/35">
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

        <ScrollReveal className="text-center mt-10" delay={0.2}>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            Open Finance e inteligência artificial entram como infraestrutura de dados — nunca como
            a mensagem principal do produto.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
