import { ChevronDown, Circle, Lightbulb, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { PhaseContent, Playbook, ThemePhase } from '../playbooks/types';

export interface DecisionPlaybookCardProps {
  readonly playbook: Playbook;
  readonly phase: ThemePhase | null | undefined;
}

const PHASE_ORDER: readonly ThemePhase[] = ['red', 'yellow', 'green'];

const PHASE_LABEL_PT: Readonly<Record<ThemePhase, string>> = {
  red: 'Vermelho',
  yellow: 'Amarelo',
  green: 'Verde',
};

const PHASE_BADGE_VARIANT: Readonly<Record<ThemePhase, 'destructive' | 'outline' | 'success'>> = {
  red: 'destructive',
  yellow: 'outline',
  green: 'success',
};

const PHASE_BADGE_CLASSNAME: Readonly<Record<ThemePhase, string | undefined>> = {
  red: undefined,
  yellow:
    'border-amber-500/60 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950/60',
  green: undefined,
};

const PHASE_DOT_CLASSNAME: Readonly<Record<ThemePhase, string>> = {
  red: 'text-red-500 dark:text-red-400',
  yellow: 'text-amber-500 dark:text-amber-400',
  green: 'text-primary-500 dark:text-primary-400',
};

const PHASE_ACCENT: Readonly<Record<ThemePhase, string>> = {
  red: 'border-l-4 border-l-red-500',
  yellow: 'border-l-4 border-l-amber-500',
  green: 'border-l-4 border-l-primary-500',
};

const PHASE_ACTIVE_BG: Readonly<Record<ThemePhase, string>> = {
  red: 'bg-red-50 dark:bg-red-950/30',
  yellow: 'bg-amber-50 dark:bg-amber-950/30',
  green: 'bg-primary-50 dark:bg-primary-950/30',
};

function PhaseSection({
  phase,
  content,
  expanded,
  onToggle,
  isActive,
}: {
  readonly phase: ThemePhase;
  readonly content: PhaseContent;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly isActive: boolean;
}) {
  const sectionId = `playbook-phase-${phase}-panel`;
  const buttonId = `playbook-phase-${phase}-button`;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border transition-colors',
        isActive
          ? cn('border-border dark:border-border-dark', PHASE_ACTIVE_BG[phase])
          : 'border-border bg-background dark:border-border-dark dark:bg-background-dark',
      )}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={sectionId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-md px-4 py-3 text-left transition-colors hover:bg-gray-100/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-gray-800/40"
      >
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Circle
              className={cn('h-3 w-3 fill-current', PHASE_DOT_CLASSNAME[phase])}
              aria-hidden
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              {PHASE_LABEL_PT[phase]}
              {isActive ? ' · você está aqui' : ''}
            </span>
          </div>
          <span className="text-sm font-semibold text-text dark:text-text-dark sm:text-base">
            {content.headline}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400',
            expanded ? 'rotate-180' : 'rotate-0',
          )}
          aria-hidden
        />
      </button>
      {expanded ? (
        <div
          id={sectionId}
          role="region"
          aria-labelledby={buttonId}
          className="space-y-3 px-4 pb-4 pt-0"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">{content.objective}</p>
          <ul className="space-y-2">
            {content.actions.map((action) => (
              <li
                key={action}
                className="flex items-start gap-2 text-sm text-text dark:text-text-dark"
              >
                <Circle
                  className="mt-1.5 h-2 w-2 shrink-0 fill-current text-primary-500 dark:text-primary-400"
                  aria-hidden
                />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function DecisionPlaybookCard({ playbook, phase }: DecisionPlaybookCardProps) {
  const initialPhase: ThemePhase = phase ?? 'green';
  const [expandedPhase, setExpandedPhase] = useState<ThemePhase>(initialPhase);

  const handleToggle = (target: ThemePhase): void => {
    setExpandedPhase((prev) => (prev === target ? prev : target));
  };

  if (phase === null || phase === undefined) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="space-y-2 p-4 sm:p-6">
          <CardTitle className="text-lg text-text dark:text-text-dark sm:text-xl">
            {playbook.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
            {playbook.explanation}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4 pt-0 sm:px-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Complete os dados para o app montar seu plano em fases.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('shadow-sm', PHASE_ACCENT[phase])}>
      <CardHeader className="space-y-3 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg text-text dark:text-text-dark sm:text-xl">
            {playbook.title}
          </CardTitle>
          <Badge
            variant={PHASE_BADGE_VARIANT[phase]}
            className={cn('w-fit', PHASE_BADGE_CLASSNAME[phase])}
          >
            {PHASE_LABEL_PT[phase]}
          </Badge>
        </div>
        <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
          {playbook.explanation}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-0 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Seu plano por etapa
          </p>
          <div className="space-y-2">
            {PHASE_ORDER.map((p) => (
              <PhaseSection
                key={p}
                phase={p}
                content={playbook.phases[p]}
                expanded={expandedPhase === p}
                onToggle={() => handleToggle(p)}
                isActive={p === phase}
              />
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-md border border-border bg-primary-50/50 px-3 py-3 dark:border-border-dark dark:bg-primary-950/20">
          <Lightbulb
            className="mt-0.5 h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400"
            aria-hidden
          />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Regra simples
            </p>
            <p className="text-sm font-medium text-text dark:text-text-dark">{playbook.rule}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-md border border-border bg-background px-3 py-3 dark:border-border-dark dark:bg-background-dark">
          <Sparkles
            className="mt-0.5 h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400"
            aria-hidden
          />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Resultado esperado
            </p>
            <p className="text-sm text-text dark:text-text-dark">{playbook.expectedImpact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
