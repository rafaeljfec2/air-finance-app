import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

/** Master questions from DASHBOARD01 — marketing only, no invented metrics. */
const PILLARS = [
  {
    name: 'Liquidez',
    question: 'Consigo operar agora e no horizonte curto?',
  },
  {
    name: 'Fluxo',
    question: 'O ciclo gera folga de verdade?',
  },
  {
    name: 'Estrutura',
    question: 'Quão rígido / ajustável é o sistema?',
  },
  {
    name: 'Crédito',
    question: 'Crédito é ponte ou muleta do sistema?',
  },
  {
    name: 'Resiliência',
    question: 'Quanto choque o sistema aguanta?',
  },
  {
    name: 'Patrimônio',
    question: 'O que a posição patrimonial observa?',
  },
] as const;

export function CheckupPillarsV3() {
  return (
    <section id="checkup-pillars" className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Check-up</div>
          <h2 className="v3-h2 mb-4">Seis pilares. Uma leitura de capacidade.</h2>
          <p className="v3-body max-w-2xl mx-auto">
            A mesma ordem do produto: do que sustenta a operação ao que observa o horizonte — sem
            misturar decisão do dia com saúde do sistema.
          </p>
        </ScrollReveal>

        <StaggerContainer
          as="ol"
          className="relative max-w-xl mx-auto"
          staggerDelay={0.09}
          delayChildren={0.06}
        >
          {PILLARS.map((pillar, index) => (
            <StaggerItem
              key={pillar.name}
              as="li"
              variant="fadeRight"
              className="relative flex gap-4 pb-8 last:pb-0 group"
            >
              <div className="relative flex w-8 shrink-0 flex-col items-center">
                <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-[var(--v3-bg)] text-xs font-bold text-emerald-400 transition-transform duration-200 group-hover:scale-110">
                  {index + 1}
                </span>
                {index < PILLARS.length - 1 ? (
                  <span className="absolute top-8 bottom-0 w-px bg-gray-800" aria-hidden />
                ) : null}
              </div>
              <div className={index < 3 ? 'pt-0.5 pb-2' : 'pt-1'}>
                <h3
                  className={
                    index < 3
                      ? 'text-lg font-semibold text-gray-50 mb-1 transition-colors duration-200 group-hover:text-emerald-300'
                      : 'text-base font-semibold text-gray-50 mb-1 transition-colors duration-200 group-hover:text-emerald-300'
                  }
                >
                  {pillar.name}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{pillar.question}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
