import { ScrollReveal } from './animations';
import { DashboardPreview } from './DashboardPreview';

export function PreviewDashboardV3() {
  return (
    <section id="dashboard-preview" className="v3-section bg-gray-50">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="v3-badge mx-auto mb-4">Produto</div>
          <h2 className="v3-h2 mb-4">A experiência do check-up</h2>
          <p className="v3-body max-w-2xl mx-auto">
            Resumo primeiro. Pilares em timeline. Detalhe sob demanda. Gráficos só para comprovar —
            nunca para liderar a conversa.
          </p>
        </ScrollReveal>

        <ScrollReveal className="max-w-md mx-auto" delay={0.1}>
          <DashboardPreview />
        </ScrollReveal>
      </div>
    </section>
  );
}
