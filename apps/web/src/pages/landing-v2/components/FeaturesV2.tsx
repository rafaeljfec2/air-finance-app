import { BarChart3, Shield, Zap, Smartphone, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Análise Inteligente',
    description: 'Visualize seus gastos e receitas com gráficos interativos e insights personalizados que te ajudam a tomar decisões melhores.',
    stat: '95%',
    statLabel: 'de precisão',
  },
  {
    icon: Zap,
    title: 'Gestão Simplificada',
    description: 'Controle suas finanças de forma intuitiva e eficiente, com categorização automática e orçamento personalizado.',
    stat: '3x',
    statLabel: 'mais rápido',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Seus dados protegidos com criptografia de ponta a ponta e sincronização em tempo real em todas as plataformas.',
    stat: '100%',
    statLabel: 'seguro',
  },
  {
    icon: Smartphone,
    title: 'Multiplataforma',
    description: 'Acesse suas finanças de qualquer lugar, a qualquer momento, em todos os dispositivos com sincronização instantânea.',
    stat: '24/7',
    statLabel: 'disponível',
  },
];

export function FeaturesV2() {
  return (
    <section id="features" className="v2-section bg-gray-50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
      
      <div className="v2-container relative z-10">
        <div className="v2-text-center v2-mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d1fae5] text-[#059669] text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Recursos Poderosos</span>
          </div>
          <h2 className="v2-h2 v2-mb-6">Tudo que você precisa em um só lugar</h2>
          <p className="v2-body max-w-2xl mx-auto text-gray-600">
            Descubra como o Airfinance pode revolucionar sua gestão financeira com ferramentas inteligentes e intuitivas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group v2-card text-left hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-[#10b981]">{feature.stat}</span>
                      <span className="text-xs font-medium text-gray-500">{feature.statLabel}</span>
                    </div>
                    <h3 className="text-xl font-semibold v2-mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
