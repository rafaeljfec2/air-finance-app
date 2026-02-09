import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

interface Plan {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly cents: string;
  readonly period: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly popular: boolean;
}

const PLANS: readonly Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'R$ 10',
    cents: ',90',
    period: '/mês',
    description: 'Para quem quer começar a organizar suas finanças com simplicidade.',
    features: [
      '1 conta bancária',
      '1 cartão de crédito',
      'Dashboard de receitas e despesas',
      'Importação de extratos via OFX',
      'Classificação automática de gastos',
      'Relatórios básicos por categoria',
    ],
    cta: 'Começar grátis',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29',
    cents: ',90',
    period: '/mês',
    description: 'Para freelancers e autônomos que querem controle total via Open Finance.',
    features: [
      'Tudo do Starter',
      'Até 2 contas bancárias via Open Finance',
      'Categorização com IA',
      'Metas de economia',
      'Relatórios avançados',
      'Exportação Excel e CSV',
    ],
    cta: 'Começar grátis',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$ 149',
    cents: ',90',
    period: '/mês',
    description: 'Para empresas e famílias que precisam separar e compartilhar finanças.',
    features: [
      'Tudo do Pro',
      'Até 2 empresas inclusas',
      'Multi-usuário por empresa',
      'Integração bancária automática',
      'Relatórios empresariais',
      'Suporte prioritário',
    ],
    cta: 'Começar grátis',
    popular: false,
  },
] as const;

export function PricingV3() {
  return (
    <section id="pricing" className="v3-section bg-gray-50">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-6">
          <div className="v3-badge mx-auto mb-4">Preços</div>
          <h2 className="v3-h2 mb-4">Simples e transparente</h2>
          <p className="v3-body max-w-xl mx-auto">
            Escolha o plano ideal para você. Todos estão gratuitos durante o beta.
          </p>
        </ScrollReveal>

        <ScrollReveal className="max-w-sm mx-auto mb-10" delay={0.1}>
          <div className="bg-emerald-500 text-white rounded-xl px-5 py-3 text-center">
            <span className="text-sm font-bold uppercase tracking-wide">
              Beta gratuito — Sem cartão de crédito
            </span>
          </div>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.1}
        >
          {PLANS.map((plan) => (
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
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl font-semibold text-gray-400">{plan.cents}</span>
                    <span className="text-sm text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">
                    Grátis durante o beta
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-600 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="w-full mt-auto">
                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
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
