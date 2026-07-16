import { CreditCard, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { sanitizeInsightCopy } from '../../helpers/sanitizeInsightCopy';

interface DecisionBlockProps {
  readonly label: string;
  readonly rationale: string;
  readonly insightMessage?: string;
}

export function DecisionBlock({ label, rationale, insightMessage }: Readonly<DecisionBlockProps>) {
  const navigate = useNavigate();
  const benefit =
    (insightMessage ? sanitizeInsightCopy(insightMessage) : '') ||
    (rationale ? sanitizeInsightCopy(rationale) : '') ||
    'Seguindo isso, você mantém o plano e evita comprometer seu futuro.';

  return (
    <section
      aria-label="Sua decisão de hoje"
      className="flex h-full flex-col justify-center rounded-xl bg-gradient-to-br from-emerald-500/[0.07] via-transparent to-transparent p-3"
    >
      <div className="flex flex-1 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
          <CreditCard className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-emerald-500">Sua decisão de hoje</p>
          <h2 className="mt-1 text-xl font-bold leading-snug text-text dark:text-text-dark">
            {label}
            {rationale.trim() ? (
              <span
                className="ml-2 inline-flex align-middle text-text-muted dark:text-text-muted-dark"
                title={rationale}
              >
                <Info className="h-4 w-4" aria-label="Detalhe da decisão" />
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted dark:text-text-muted-dark">
            {benefit}
          </p>
          <Button
            type="button"
            onClick={() => navigate('/decision')}
            className="mt-3 h-9 border border-emerald-500/30 bg-emerald-500/20 px-4 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
          >
            Ver detalhes da decisão
          </Button>
        </div>
      </div>
    </section>
  );
}
