import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AmbientBlob, ScrollReveal } from './animations';

export function CTAFinalV3() {
  const navigate = useNavigate();

  return (
    <section id="cta-capacity" className="v3-section v3-section-dark relative overflow-hidden">
      <AmbientBlob
        className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
        duration={16}
        x={20}
        y={10}
      />
      <AmbientBlob
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
        duration={20}
        x={-16}
        y={12}
      />

      <div className="v3-container relative z-10">
        <ScrollReveal variant="scale" className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
            Finalmente explique
            <br />
            <span className="text-emerald-400">a sua vida financeira.</span>
          </h2>

          <p className="text-base md:text-lg text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Você passa a compreender a capacidade do seu sistema — grátis no beta, sem cartão de
            crédito.
          </p>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="v3-btn-primary !px-8 !py-4 !text-base group"
            aria-label="Descobrir minha capacidade financeira"
          >
            Descobrir minha capacidade financeira
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
