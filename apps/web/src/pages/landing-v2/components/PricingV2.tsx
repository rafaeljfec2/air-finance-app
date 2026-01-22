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
      'Recomendado para freelancers e autônomos',
      'Até 2 contas bancárias',
      'R$ 6,00 por conta adicional',
      'Relatório avançado',
      'Metas de economia',
      'Exportação de dados',
      'Insights gerados por IA',
      'Integração Open Finance via Pierre Finance',
    ],
    cta: 'Escolher este plano',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$ 149',
    period: '/mês',
    features: [
      'Tudo do plano Pro',
      'Recomendado para empresas',
      'Até 2 empresas',
      'R$ 29,00 por empresa adicional',
      'Até 2 contas bancárias por empresa',
      'R$ 12,00 por conta adicional por empresa',
      'Integração bancária via API do Inter',
      'Insights gerados por IA',
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
            Escolha o plano ideal para suas necessidades e comece a transformar sua vida financeira
            hoje
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
                  Durante este período, você é livre para usar qualquer plano gratuitamente. Se
                  fizer sentido para você, pode contribuir e nos ajudar a melhorar o Airfinance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`v2-card flex flex-col relative transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-[#10b981] shadow-lg'
                  : 'hover:border-[#10b981]/50 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Mais popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-2xl font-semibold text-gray-500">,90</span>
                  {plan.period && (
                    <span className="text-base text-gray-500 ml-1.5">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 mb-5 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#d1fae5] flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    </div>
                    <span className="text-base text-gray-700 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Pierre Finance Pro Highlight for Pro Plan */}
              {plan.id === 'pro' && (
                <div className="mb-5 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                      <span className="text-white font-bold text-[11px]">P</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">
                        Pierre Finance Pro
                      </p>
                      <p className="text-xs text-gray-600 mb-1.5">
                        Custo adicional de{' '}
                        <span className="font-bold text-blue-600">R$ 39/mês</span> pago diretamente
                        ao Pierre Finance
                      </p>
                      <div className="flex flex-col gap-1">
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
                  className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md'
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
