import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { QuickAnalysis } from '../mappers/buildQuickAnalysis';

interface QuickAnalysisCardProps {
  readonly analysis: QuickAnalysis;
}

function analysisMessage(analysis: QuickAnalysis): string {
  if (analysis.status === 'inconclusive') {
    return 'Ainda não há despesas suficientes nos últimos 30 dias para comparar seus gastos.';
  }
  if (analysis.direction === 'stable') {
    return 'Seus gastos desta semana estão na média dos últimos 30 dias.';
  }
  const direction = analysis.direction === 'below' ? 'abaixo' : 'acima';
  return `Seus gastos desta semana estão ${analysis.percent}% ${direction} da média dos últimos 30 dias.`;
}

export function QuickAnalysisCard({ analysis }: Readonly<QuickAnalysisCardProps>) {
  const navigate = useNavigate();

  return (
    <section
      aria-label="Análise rápida"
      className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
    >
      <h2 className="text-sm font-semibold text-text dark:text-text-dark">Análise rápida</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {analysisMessage(analysis)}
      </p>

      <button
        type="button"
        onClick={() => navigate('/insights')}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        Ver análise completa
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </section>
  );
}
