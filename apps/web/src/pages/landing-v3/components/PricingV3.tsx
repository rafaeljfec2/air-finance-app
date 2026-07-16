import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MARKETING_PLANS } from '@/constants/marketingPlans';

import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

export function PricingV3() {
  return (
    <section id="pricing" className="v3-section bg-[var(--v3-bg-alt)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-6">
          <div className="v3-badge mx-auto mb-4">Preços</div>
          <h2 className="v3-h2 mb-4">Simples e transparente</h2>
          <p className="v3-body max-w-xl mx-auto">
            Escolha o plano ideal para o seu momento. Assinatura mensal, sem fidelidade.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.1}
        >
          {MARKETING_PLANS.map((plan) => (
            <StaggerItem key={plan.id} variant="scale">
              <div
                className={`v3-card flex flex-col relative h-full ${
                  plan.popular ? 'border-2 border-emerald-500 shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Mais popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-50 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl font-bold text-gray-50">{plan.price}</span>
                    <span className="text-xl font-semibold text-gray-500">{plan.cents}</span>
                    <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-300 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/pricing" className="w-full mt-auto">
                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
                        : 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700'
                    }`}
                    aria-label={`${plan.cta} - Plano ${plan.name}`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
