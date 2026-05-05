import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sparkles } from 'lucide-react';

import { COMPLETE_PLAN_LABELS } from './copy';

export interface CompletePlanOutcomeProps {
  readonly text: string;
  readonly cached?: boolean;
  readonly referencePeriod?: string;
  readonly generatedAt?: string;
}

function formatGeneratedAt(iso: string): string {
  try {
    return format(parseISO(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return iso;
  }
}

export function CompletePlanOutcome({
  text,
  cached,
  referencePeriod,
  generatedAt,
}: CompletePlanOutcomeProps) {
  const metaParts: string[] = [];
  if (referencePeriod !== undefined && referencePeriod.trim() !== '') {
    metaParts.push(`Período: ${referencePeriod.trim()}`);
  }
  if (generatedAt !== undefined && generatedAt.trim() !== '') {
    metaParts.push(`Atualizado em ${formatGeneratedAt(generatedAt.trim())}`);
  }
  const metaLine = metaParts.join(' · ');

  return (
    <section
      aria-labelledby="cp-outcome-title"
      className="rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <div className="flex items-start gap-3">
        <Sparkles
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-500 dark:text-primary-400"
          aria-hidden
        />
        <div className="space-y-1">
          <h3
            id="cp-outcome-title"
            className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            {COMPLETE_PLAN_LABELS.outcomeTitle}
          </h3>
          {metaLine !== '' ? (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{metaLine}</p>
          ) : null}
          <p className="whitespace-pre-line text-sm leading-relaxed text-text dark:text-text-dark sm:text-base">
            {text}
          </p>
          {cached === true ? (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {COMPLETE_PLAN_LABELS.cachedHint}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
