import { Modal } from '@/components/ui/Modal';

import { Callout, Pill, Stack, Text } from '../laudo-layout/primitives';
import type { CapacityState, FinancialHealthPillar } from '../types';
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

interface PillarDetailModalProps {
  readonly pillar: FinancialHealthPillar | null;
  readonly onClose: () => void;
}

export function PillarDetailModal({ pillar, onClose }: PillarDetailModalProps) {
  if (!pillar) {
    return null;
  }

  return (
    <Modal open onClose={onClose} title={pillar.name} className="max-w-xl">
      <div className="space-y-5">
        <Stack gap={8}>
          <Text size="small" tone="secondary">
            {pillar.question}
          </Text>
          <Text size="small" tone="secondary">
            Período desta leitura: {pillar.horizonLabel}
          </Text>
        </Stack>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-2xl font-bold tabular-nums tracking-tight text-text dark:text-text-dark">
            {pillar.primaryFormatted ?? '—'}
          </p>
          <Pill tone={stateTone(pillar.state)}>{CAPACITY_STATE_LABEL[pillar.state]}</Pill>
        </div>
        <p className="text-xs text-muted-foreground">{pillar.primaryLabel}</p>

        <Stack gap={8}>
          <Text weight="semibold">O que este número significa</Text>
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
          Como este pilar se conecta: {pillar.connections.join(' · ')}
        </Text>

        {pillar.hasGap || pillar.exploreHint ? (
          <Callout tone="warning">
            {pillar.hasGap ? (
              <Text size="small">
                Lacuna declarada: a leitura é parcial ou ainda incompleta — sem inventar certeza.
              </Text>
            ) : null}
            {pillar.exploreHint ? (
              <Text size="small" className={pillar.hasGap ? 'mt-2' : undefined}>
                Limitação: {pillar.exploreHint}
              </Text>
            ) : null}
          </Callout>
        ) : null}

        <Text size="small" tone="secondary">
          Este detalhe explica capacidade. Não recomenda um gesto do dia — isso fica na Home.
        </Text>
      </div>
    </Modal>
  );
}
