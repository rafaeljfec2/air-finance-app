import { Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    features: [
      '1 conta bancária',
      '1 cartão de crédito',
      'Gestão de transações',
      'Relatório básico',
    ],
    cta: 'Começar agora',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29',
    period: '/mês',
    features: [
      'Tudo do plano Gratuito',
      'Contas bancárias ilimitadas',
      'Cartões ilimitados',
      'Relatório avançado',
      'Metas de economia',
      'Exportação de dados',
      'Exclusivo para CPF',
      'Integração Open Finance via Pierre Finance',
    ],
    cta: 'Escolher este plano',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$ 79',
    period: '/mês',
    features: [
      'Tudo do plano Pro',
      'Integração bancária via API do Inter',
      'Múltiplos usuários',
      'Compartilhamento de conta',
      'Metas compartilhadas',
      'Controle de gastos familiar',
      'Suporte prioritário',
    ],
    cta: 'Escolher este plano',
    popular: false,
  },
];

export function PricingV2() {
  return (
    <section id="pricing" className="v2-section bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="v2-container">
        <div className="v2-text-center v2-mb-12">
          <h2 className="v2-h2 v2-mb-6">Planos para todos os perfis</h2>
          <p className="v2-body max-w-2xl mx-auto text-gray-600 mb-8">
            Escolha o plano ideal para suas necessidades e comece a transformar sua vida financeira hoje
          </p>
          
          {/* Beta Banner */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#10b981]/10 via-[#10b981]/5 to-[#10b981]/10 border-2 border-[#10b981]/20">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">β</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Estamos em fase Beta por tempo limitado
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Durante este período, você é livre para usar qualquer plano gratuitamente. 
                  Se fizer sentido para você, pode contribuir e nos ajudar a melhorar o Airfinance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`v2-card flex flex-col relative transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-[#10b981] shadow-xl scale-105'
                  : 'hover:border-[#10b981]/50 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  Mais popular
                </div>
              )}
              
              <div className="v2-mb-6">
                <h3 className="v2-h3 v2-mb-2">{plan.name}</h3>
              </div>
              
              <div className="v2-mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-2xl font-semibold text-gray-500">,90</span>
                  {plan.period && (
                    <span className="text-lg text-gray-500 ml-2">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 v2-mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d1fae5] flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Pierre Finance Pro Highlight for Pro Plan */}
              {plan.id === 'pro' && (
                <div className="v2-mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Pierre Finance Pro
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        Custo adicional de <span className="font-bold text-blue-600">R$ 39/mês</span> pago diretamente ao Pierre Finance
                      </p>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://pierre.finance/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Saiba mais sobre o Pierre Finance Pro
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <Link
                          to="/pierre-finance-config"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Saiba como configurar
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Link to="/register" className="w-full">
                <button
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                  }`}
                  aria-label={`${plan.cta} - Plano ${plan.name}`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
