import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';
import { InteractiveCard } from './InteractiveCard';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Ideal para começar',
    price: 'R$ 0,00',
    period: '/mês',
    features: ['Controle manual', 'Dashboard básico', 'Até 2 contas', 'Até 2 cartões'],
    cta: 'Começar agora',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'O favorito dos freelancers',
    price: 'R$ 29,90',
    period: '/mês',
    features: [
      'Tudo do Free',
      'IA Ilimitada',
      'Até 5 contas bancárias',
      'Até 2 cartões de crédito',
      'Importação OFX',
      'Insights gerados por IA',
      'Exclusivo para CPF',
      'Integração Open Finance via Pierre Finance',
    ],
    cta: 'Começar Agora',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para empresas em crescimento',
    price: 'R$ 79,90',
    period: '/mês',
    features: [
      'Tudo do plano Pro',
      'Integração bancária via API do Inter',
      'Insights gerados por IA',
      'Gestão Multi-empresas (CNPJ)',
      'Múltiplos usuários e permissões',
      'Conciliação bancária automática',
      'Suporte prioritário',
    ],
    cta: 'Escolher este plano',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-32 px-6 bg-white relative z-10"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-arrow" id="pricing-heading">
            Planos para todos os perfis
          </h2>
          <p className="text-xl text-text/80 max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades e comece a transformar sua vida financeira
            hoje
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.id} variant="scale" delay={index * 0.2} className="h-full">
              <InteractiveCard className="h-full">
                <div
                  className={`rounded-2xl p-8 h-full flex flex-col transition-all duration-300 ${
                    plan.popular
                      ? 'bg-brand-arrow text-white shadow-2xl'
                      : 'bg-background border border-border hover:border-brand-arrow/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-brand-arrow text-sm font-semibold px-4 py-1 rounded-full">
                      Mais popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3
                      className={`text-2xl font-semibold mb-2 ${
                        plan.popular ? 'text-white' : 'text-brand-arrow'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className={plan.popular ? 'text-white/80' : 'text-text/80'}>
                      {plan.description}
                    </p>
                  </div>
                  <div className="mb-8">
                    <span
                      className={`text-4xl font-bold ${
                        plan.popular ? 'text-white' : 'text-brand-arrow'
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={plan.popular ? 'opacity-80 ml-2' : 'text-text/60 ml-2'}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 flex-shrink-0 ${
                            plan.popular ? 'text-white' : 'text-brand-arrow'
                          }`}
                        />
                        <span className={plan.popular ? 'text-white' : 'text-text/80'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full">
                    <Button
                      className={`w-full py-6 text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        plan.popular
                          ? 'bg-white text-brand-arrow hover:bg-white/90 focus:ring-white'
                          : 'bg-brand-arrow hover:bg-brand-arrow/90 text-white focus:ring-brand-arrow'
                      }`}
                      aria-label={`${plan.cta} - Plano ${plan.name}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
