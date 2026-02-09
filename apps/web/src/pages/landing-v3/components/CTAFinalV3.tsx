import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './animations';

export function CTAFinalV3() {
  const navigate = useNavigate();

  return (
    <section className="v3-section v3-section-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="v3-container relative z-10">
        <ScrollReveal variant="scale" className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
            Pare de adivinhar.
            <br />
            <span className="text-emerald-400">Veja seus números.</span>
          </h2>

          <p className="text-base md:text-lg text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Crie sua conta em 1 minuto. Grátis durante o beta. Sem cartão de crédito.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="v3-btn-primary !px-8 !py-4 !text-base group"
            aria-label="Criar conta grátis no Airfinance"
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
