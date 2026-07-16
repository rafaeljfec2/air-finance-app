import { ArrowDown } from 'lucide-react';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const RELATION_CHAIN = [
  'Receita',
  'Fluxo',
  'Liquidez',
  'Estrutura',
  'Crédito',
  'Resiliência',
  'Patrimônio',
] as const;

export function ModelBehindV3() {
  return (
    <section id="model-behind" className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="v3-badge mx-auto mb-4">O modelo</div>
          <h2 className="v3-h2 mb-4">
            Não analisamos números.
            <br className="hidden sm:block" />
            <span className="text-emerald-400">Interpretamos relações.</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="space-y-4 text-left">
              <p className="v3-body text-gray-300">Um saldo alto não significa boa liquidez.</p>
              <p className="v3-body text-gray-300">
                Uma boa liquidez não significa uma estrutura saudável.
              </p>
              <p className="v3-body text-gray-300">
                Um fluxo positivo não garante capacidade de longo prazo.
              </p>
              <p className="v3-body text-gray-400 pt-2">
                Cada parte conta apenas um pedaço da história. O AirFinance conecta essas relações
                para explicar como o seu sistema financeiro realmente funciona.
              </p>
              <p className="text-base font-semibold text-gray-50 pt-4 leading-relaxed">
                Outros aplicativos mostram dados.
                <br />
                <span className="text-emerald-400">O AirFinance interpreta o sistema.</span>
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div
              className="rounded-2xl border border-gray-800 bg-[var(--v3-bg-alt)] px-5 py-6 md:px-8 md:py-8"
              aria-label="Diagrama conceitual: relações até a capacidade financeira"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 text-center mb-5">
                Como as partes se relacionam
              </p>

              <StaggerContainer className="flex flex-col items-center" staggerDelay={0.06}>
                {RELATION_CHAIN.map((label) => (
                  <StaggerItem
                    key={label}
                    className="flex flex-col items-center w-full max-w-[220px]"
                  >
                    <div className="w-full rounded-xl border border-gray-700 bg-[#111827] px-4 py-2.5 text-center">
                      <span className="text-sm font-medium text-gray-200">{label}</span>
                    </div>
                    <ArrowDown
                      className="my-1.5 h-4 w-4 text-emerald-500/60 shrink-0"
                      aria-hidden
                    />
                  </StaggerItem>
                ))}

                <StaggerItem className="w-full max-w-[220px]">
                  <div className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center">
                    <span className="text-sm font-semibold text-emerald-300">
                      Capacidade financeira
                    </span>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <p className="text-xs text-gray-500 text-center mt-5 leading-relaxed">
                Não é uma lista de métricas. É um modelo de relações.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
