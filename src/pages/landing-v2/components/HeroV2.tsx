import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FinancialDashboard } from './FinancialDashboard';

export function HeroV2() {
  const navigate = useNavigate();

  return (
    <section className="v2-section min-h-screen flex items-center bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 pt-32 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#10b981]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#10b981]/3 rounded-full blur-3xl" />

      <div className="v2-container w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d1fae5] text-[#059669] text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" />
              <span>10.000+ usuários confiam no Airfinance</span>
            </div>

            <h1 className="v2-h1 v2-mb-8 leading-[1.1]">
              Transforme sua vida financeira{' '}
              <span className="relative">
                <span className="text-[#10b981]">com inteligência</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#10b981]/20 -z-10 rounded-full" />
              </span>
            </h1>

            <p className="v2-body v2-mb-12 max-w-xl text-gray-600 leading-relaxed">
              Reúna todas as suas despesas em um único aplicativo e simplifique suas finanças com o
              nosso gerenciador inteligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="v2-btn-primary group"
                aria-label="Começar a usar o Airfinance"
              >
                Começar agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="v2-btn-secondary"
                aria-label="Ver recursos"
              >
                Ver recursos
              </button>
            </div>
          </div>

          <div className="hidden md:block relative">
            <FinancialDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
