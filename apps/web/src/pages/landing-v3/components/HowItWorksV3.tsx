import { useNavigate } from 'react-router-dom';
import { UserPlus, Link2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const STEPS = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Crie sua conta',
    description: 'Cadastro rápido com email ou Google. Sem cartão de crédito, sem compromisso.',
  },
  {
    icon: Link2,
    number: '02',
    title: 'Conecte seus bancos',
    description:
      'Escolha seus bancos e autorize via Open Finance. Seguro e regulado pelo Banco Central.',
  },
  {
    icon: LayoutDashboard,
    number: '03',
    title: 'Veja tudo no painel',
    description:
      'Suas transações aparecem categorizadas automaticamente. É só acompanhar e decidir.',
  },
] as const;

export function HowItWorksV3() {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="v3-section bg-gray-50">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Simples</div>
          <h2 className="v3-h2 mb-4">Comece em 3 minutos</h2>
          <p className="v3-body max-w-xl mx-auto">
            Do cadastro ao painel completo em poucos passos. Sem burocracia.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
          staggerDelay={0.15}
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.title}>
                <div className="relative text-center">
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gray-200" />
                  )}

                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm mb-5">
                    <Icon className="w-7 h-7 text-emerald-600" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.number.replace('0', '')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <ScrollReveal className="text-center" delay={0.3}>
          <button
            onClick={() => navigate('/register')}
            className="v3-btn-primary"
            aria-label="Criar conta grátis"
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
