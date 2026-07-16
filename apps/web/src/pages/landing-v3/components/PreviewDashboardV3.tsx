import { ScrollReveal } from './animations';
import { DashboardPreview } from './DashboardPreview';

export function PreviewDashboardV3() {
  return (
    <section id="dashboard-preview" className="v3-section bg-[var(--v3-bg-alt)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="v3-badge mx-auto mb-4">Check-up Financeiro</div>
          <h2 className="v3-h2 mb-4">Um vislumbre da compreensão</h2>
          <p className="v3-body max-w-2xl mx-auto">
            Só o suficiente para sentir a diferença: interpretação do sistema, não uma parede de
            números. O Check-up completo acontece com os seus dados.
          </p>
        </ScrollReveal>

        <div className="max-w-md mx-auto">
          <DashboardPreview showCheckupCta />
        </div>
      </div>
    </section>
  );
}
