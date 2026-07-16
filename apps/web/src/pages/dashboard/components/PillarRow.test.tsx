import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FinancialHealthPillar } from '../types';

import { PillarRow } from './PillarRow';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

const samplePillar: FinancialHealthPillar = {
  id: 'structure',
  name: 'Estrutura',
  question: 'Quão rígido / ajustável é o sistema?',
  primaryLabel: 'Proxy dívida/renda',
  primaryValue: 50,
  primaryFormatted: '50%',
  state: 'critical',
  interpretation: 'Interpretação detalhada do pilar Estrutura.',
  influencers: {
    improves: ['Reduzir rigidez de obrigacoes'],
    worsens: ['Comprometer mais renda fixa'],
  },
  connections: ['Liquidez', 'Fluxo'],
  summarySentence: 'Estrutura sob tensao.',
  hasGap: true,
  exploreHint: 'Proxy parcial.',
};

describe('PillarRow', () => {
  it('shows only scan fields when collapsed', () => {
    render(<PillarRow pillar={samplePillar} expanded={false} onToggle={() => undefined} />);

    expect(screen.getByRole('heading', { name: 'Estrutura' })).toBeInTheDocument();
    expect(screen.getByText('Crítica')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(
      screen.queryByText('Interpretação detalhada do pilar Estrutura.'),
    ).not.toBeInTheDocument();
  });

  it('reveals interpretation when expanded', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <PillarRow pillar={samplePillar} expanded={false} onToggle={onToggle} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Explorar' }));
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<PillarRow pillar={samplePillar} expanded onToggle={onToggle} />);
    expect(screen.getByText('Interpretação detalhada do pilar Estrutura.')).toBeInTheDocument();
  });
});
