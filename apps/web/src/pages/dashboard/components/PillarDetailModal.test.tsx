import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { FinancialHealthPillar } from '../types';

import { PillarDetailModal } from './PillarDetailModal';

vi.mock('@/components/ui/Modal', () => ({
  Modal: ({
    children,
    title,
    open,
  }: {
    readonly children: ReactNode;
    readonly title?: string;
    readonly open: boolean;
  }) =>
    open ? (
      <div role="dialog" aria-label={title}>
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    ) : null,
}));

const samplePillar: FinancialHealthPillar = {
  id: 'flow',
  name: 'Fluxo',
  question: 'O ciclo gera folga de verdade?',
  horizonLabel: 'Este período',
  primaryLabel: 'Resultado do período',
  primaryValue: -1200,
  primaryFormatted: '-R$ 1.200,00',
  state: 'attention',
  interpretation: 'A folga do ciclo é frágil neste período.',
  influencers: {
    improves: ['Resultado do período positivo'],
    worsens: ['Despesas acima da receita do período'],
  },
  connections: ['Estrutura', 'Liquidez'],
  summarySentence: 'Fluxo sob tensão — a folga do ciclo é estreita.',
  hasGap: true,
  exploreHint: 'Leitura parcial: usa receita e despesa do período selecionado.',
};

describe('PillarDetailModal', () => {
  it('renders nothing when pillar is null', () => {
    const { container } = render(<PillarDetailModal pillar={null} onClose={() => undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('explains question, horizon, meaning, influencers and human limitation', () => {
    render(<PillarDetailModal pillar={samplePillar} onClose={() => undefined} />);

    expect(screen.getByRole('heading', { name: 'Fluxo' })).toBeInTheDocument();
    expect(screen.getByText('O ciclo gera folga de verdade?')).toBeInTheDocument();
    expect(screen.getByText(/Período desta leitura:\s*Este período/)).toBeInTheDocument();
    expect(screen.getByText('-R$ 1.200,00')).toBeInTheDocument();
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('A folga do ciclo é frágil neste período.')).toBeInTheDocument();
    expect(screen.getByText(/Resultado do período positivo/)).toBeInTheDocument();
    expect(screen.getByText(/Despesas acima da receita do período/)).toBeInTheDocument();
    expect(
      screen.getByText(/Leitura parcial: usa receita e despesa do período selecionado/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/FIN-/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/proxy/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/runway/i)).not.toBeInTheDocument();
  });
});
