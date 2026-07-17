import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FinancialHealthPillar } from '../types';

import { PillarCard } from './PillarCard';

const samplePillar: FinancialHealthPillar = {
  id: 'liquidity',
  name: 'Liquidez',
  question: 'Consigo operar agora e no horizonte curto?',
  primaryLabel: 'Caixa disponível',
  primaryValue: 12500,
  primaryFormatted: 'R$ 12.500,00',
  state: 'good',
  interpretation: 'Interpretação da liquidez.',
  influencers: { improves: ['Receber antes'], worsens: ['Antecipar despesas'] },
  connections: ['Crédito', 'Fluxo'],
  summarySentence: 'Liquidez saudável.',
  hasGap: false,
  exploreHint: null,
};

describe('PillarCard', () => {
  it('renders scan fields: name, state badge, value, label and question', () => {
    render(<PillarCard pillar={samplePillar} onExplore={() => undefined} />);

    expect(screen.getByRole('heading', { name: 'Liquidez' })).toBeInTheDocument();
    expect(screen.getByText('Boa')).toBeInTheDocument();
    expect(screen.getByText('R$ 12.500,00')).toBeInTheDocument();
    expect(screen.getByText('Caixa disponível')).toBeInTheDocument();
    expect(screen.getByText('Consigo operar agora e no horizonte curto?')).toBeInTheDocument();
  });

  it('falls back to a dash when the value is unavailable', () => {
    render(
      <PillarCard
        pillar={{ ...samplePillar, primaryFormatted: null, state: 'inconclusive' }}
        onExplore={() => undefined}
      />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Inconclusivo')).toBeInTheDocument();
  });

  it('calls onExplore when the explore button is clicked', () => {
    const onExplore = vi.fn();
    render(<PillarCard pillar={samplePillar} onExplore={onExplore} />);

    fireEvent.click(screen.getByRole('button', { name: /Explorar/ }));
    expect(onExplore).toHaveBeenCalledTimes(1);
  });
});
