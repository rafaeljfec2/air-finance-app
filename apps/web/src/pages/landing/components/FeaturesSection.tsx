import { CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { InteractiveCard } from './InteractiveCard';
import dashboardImage from '@/assets/images/landing/dashboard.svg';
import mobileImage from '@/assets/images/landing/mobile.svg';
import securityImage from '@/assets/images/landing/security.svg';

const features = [
  {
    id: 1,
    title: 'Análise Inteligente',
    description: 'Visualize seus gastos e receitas com gráficos interativos e insights personalizados.',
    image: dashboardImage,
    imageAlt: 'Dashboard inteligente com gráficos e análises financeiras',
    items: ['Dashboard personalizado', 'Relatórios automáticos', 'Previsões financeiras'],
  },
  {
    id: 2,
    title: 'Gestão Simplificada',
    description: 'Controle suas finanças de forma intuitiva e eficiente.',
    image: mobileImage,
    imageAlt: 'Aplicativo móvel do Airfinance',
    items: ['Categorização automática', 'Orçamento personalizado', 'Metas financeiras'],
  },
  {
    id: 3,
    title: 'Multiplataforma',
    description: 'Acesse suas finanças de qualquer lugar, a qualquer momento.',
    image: securityImage,
    imageAlt: 'Sincronização multiplataforma segura',
    items: ['Aplicativo móvel', 'Sincronização em tempo real', 'Backup automático'],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 bg-white relative z-10" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-arrow">
            Recursos que transformam
          </h2>
          <p className="text-xl text-text/80 max-w-3xl mx-auto">
            Descubra como o Airfinance pode revolucionar sua gestão financeira
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.id}
              variant="slideUp"
              delay={index * 0.2}
              className="h-full"
            >
              <InteractiveCard className="h-full">
                <div className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="mb-6">
                    <img
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-auto mb-6 rounded-lg"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                    <h3 className="text-2xl font-semibold mb-4 text-brand-arrow">
                      {feature.title}
                    </h3>
                    <p className="text-text/80 mb-6">{feature.description}</p>
                  </div>
                  <ul className="space-y-3 mt-auto">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-text/80">
                        <CheckCircle2 className="w-5 h-5 text-brand-arrow flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

