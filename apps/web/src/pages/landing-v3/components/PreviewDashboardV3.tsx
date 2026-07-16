import { ScrollReveal } from './animations';
import { DashboardPreview } from './DashboardPreview';

export function PreviewDashboardV3() {
  return (
    <section id="dashboard-preview" className="v3-section bg-[var(--v3-bg-alt)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="v3-badge mx-auto mb-4">Preview</div>
          <h2 className="v3-h2 mb-4">Um vislumbre da compreensão</h2>
          <p className="v3-body max-w-2xl mx-auto">
            Só o suficiente para você sentir o que muda. A leitura completa da sua capacidade
            acontece depois — com os seus dados, no seu ritmo.
          </p>
        </ScrollReveal>

        <div className="max-w-md mx-auto">
          <DashboardPreview showCheckupCta />
        </div>
      </div>
    </section>
  );
}
