import type { FinancialHealthPillar, PillarId } from '../types';

import { PillarRow } from './PillarRow';

export function PillarTimeline({
  pillars,
  expandedPillarId,
  onToggle,
}: Readonly<{
  pillars: readonly FinancialHealthPillar[];
  expandedPillarId: PillarId | null;
  onToggle: (id: PillarId) => void;
}>) {
  return (
    <section aria-label="Seis pilares da capacidade">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Check-up · seis pilares
      </h2>
      <div className="flex flex-col">
        {pillars.map((pillar, index) => (
          <PillarRow
            key={pillar.id}
            pillar={pillar}
            expanded={expandedPillarId === pillar.id}
            isLast={index === pillars.length - 1}
            onToggle={() => onToggle(pillar.id)}
          />
        ))}
      </div>
    </section>
  );
}
