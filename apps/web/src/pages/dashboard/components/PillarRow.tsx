import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Callout, Pill, Stack, Text } from '../laudo-layout/primitives';
import { pillarDetailVariants, reducedPillarDetailVariants } from '../motion';
import type { CapacityState, FinancialHealthPillar, PillarId } from '../types';
import { CAPACITY_STATE_LABEL } from '../types';

function stateTone(state: CapacityState): 'neutral' | 'info' | 'warning' | 'success' | 'danger' {
  switch (state) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'attention':
      return 'warning';
    case 'critical':
      return 'danger';
    case 'inconclusive':
      return 'info';
    default:
      return 'neutral';
  }
}

const PRIMARY_PILLARS: ReadonlySet<PillarId> = new Set(['liquidity', 'flow', 'structure']);

export function PillarRow({
  pillar,
  expanded,
  onToggle,
  isLast,
}: Readonly<{
  pillar: FinancialHealthPillar;
  expanded: boolean;
  onToggle: () => void;
  isLast?: boolean;
}>) {
  const reduceMotion = useReducedMotion();
  const detailVariants = reduceMotion ? reducedPillarDetailVariants : pillarDetailVariants;
  const isPrimary = PRIMARY_PILLARS.has(pillar.id);
  const panelId = `pillar-${pillar.id}-detail`;
  const buttonId = `pillar-${pillar.id}-explore`;

  return (
    <div className="relative flex gap-4">
      <div className="relative flex w-5 shrink-0 flex-col items-center">
        <span
          className={cn(
            'z-10 mt-5 h-3 w-3 rounded-full border-2 border-primary-500 bg-card dark:bg-card-dark',
            isPrimary ? 'h-3.5 w-3.5' : undefined,
          )}
          aria-hidden
        />
        {!isLast ? (
          <span
            className="absolute top-8 bottom-0 w-px bg-border dark:bg-border-dark"
            aria-hidden
          />
        ) : null}
      </div>

      <div
        className={cn(
          'mb-3 min-w-0 flex-1 rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark',
          pillar.id === 'structure' ? 'mb-6' : undefined,
        )}
      >
        <div className={cn('px-4', isPrimary ? 'py-5 sm:px-5 sm:py-6' : 'py-3.5 sm:py-4')}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={cn(
                    'font-semibold tracking-tight text-text dark:text-text-dark',
                    isPrimary ? 'text-lg sm:text-xl' : 'text-base sm:text-lg',
                  )}
                >
                  {pillar.name}
                </h2>
                <Pill tone={stateTone(pillar.state)}>{CAPACITY_STATE_LABEL[pillar.state]}</Pill>
              </div>
              <p
                className={cn(
                  'tabular-nums font-bold text-text dark:text-text-dark',
                  isPrimary ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl',
                )}
              >
                {pillar.primaryFormatted ?? '—'}
              </p>
              <p className="text-xs text-muted-foreground">{pillar.primaryLabel}</p>
              <p
                className={cn(
                  'text-text dark:text-text-dark',
                  isPrimary ? 'text-sm sm:text-base' : 'text-sm',
                )}
              >
                {pillar.question}
              </p>
            </div>
            <Button
              type="button"
              id={buttonId}
              variant="outline"
              size="sm"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={onToggle}
              className="shrink-0"
            >
              {expanded ? 'Fechar' : 'Explorar'}
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="detail"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={detailVariants}
              className="overflow-hidden border-t border-border dark:border-border-dark"
            >
              <div className="space-y-4 px-4 py-4 sm:px-5">
                <Stack gap={8}>
                  <Text weight="semibold">Interpretação</Text>
                  <Text>{pillar.interpretation}</Text>
                </Stack>
                <Stack gap={8}>
                  <Text weight="semibold">O que fortalece</Text>
                  {pillar.influencers.improves.map((item) => (
                    <Text key={item} size="small">
                      · {item}
                    </Text>
                  ))}
                </Stack>
                <Stack gap={8}>
                  <Text weight="semibold">O que enfraquece</Text>
                  {pillar.influencers.worsens.map((item) => (
                    <Text key={item} size="small">
                      · {item}
                    </Text>
                  ))}
                </Stack>
                <Text size="small" tone="secondary">
                  Conexões: {pillar.connections.join(' · ')}
                </Text>
                {pillar.hasGap || pillar.exploreHint ? (
                  <Callout tone="warning">
                    {pillar.hasGap
                      ? 'Lacuna declarada: leitura parcial ou proxy — sem inventar certeza.'
                      : null}
                    {pillar.exploreHint ? (
                      <Text size="small" className={pillar.hasGap ? 'mt-2' : undefined}>
                        Limitação: {pillar.exploreHint}
                      </Text>
                    ) : null}
                  </Callout>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
