import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AmbientBlob, HeroAnimation } from './animations';
import { DashboardPreview } from './DashboardPreview';

export function HeroV3() {
  const navigate = useNavigate();

  return (
    <section className="v3-section min-h-[90vh] flex items-center pt-20 relative overflow-hidden bg-[var(--v3-bg)]">
      <AmbientBlob
        className="absolute top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"
        duration={14}
        x={24}
        y={16}
      />
      <AmbientBlob
        className="absolute bottom-0 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl opacity-40 pointer-events-none"
        duration={18}
        x={-20}
        y={14}
      />

      <div className="v3-container w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <HeroAnimation delay={0}>
              <div className="v3-badge mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Grátis durante o beta</span>
              </div>
            </HeroAnimation>

            <HeroAnimation delay={0.08}>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400 mb-3">
                AirFinance
              </p>
              <h1 className="v3-h1 mb-6">
                Entenda a capacidade
                <br />
                do seu sistema
                <br />
                <span className="text-emerald-400">financeiro.</span>
              </h1>
            </HeroAnimation>

            <HeroAnimation delay={0.16}>
              <p className="v3-body-lg mb-8 max-w-lg">
                Um check-up claro da saúde do seu dinheiro — para você tomar melhores decisões. Sem
                culpa. Sem score. Sem o produto decidir por você.
              </p>
            </HeroAnimation>

            <HeroAnimation delay={0.24}>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="v3-btn-primary group"
                  aria-label="Começar a entender meu sistema"
                >
                  Começar a entender meu sistema
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById('checkup-pillars')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="v3-btn-secondary"
                  aria-label="Ver o check-up"
                >
                  Ver o check-up
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Sem cartão de crédito. Cadastro em 1 minuto.
              </p>
            </HeroAnimation>
          </div>

          <HeroAnimation delay={0.32} className="relative">
            <DashboardPreview animateOnMount />
          </HeroAnimation>
        </div>
      </div>
    </section>
  );
}
