import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FinancialHealthPillar } from '../types';

import { PillarCard } from './PillarCard';

const samplePillar: FinancialHealthPillar = {
  id: 'liquidity',
  name: 'Liquidez',
  question: 'Consigo operar agora e no horizonte curto?',
  horizonLabel: 'Horizonte curto',
  primaryLabel: 'Caixa disponível',
  primaryValue: 12500,
  primaryFormatted: 'R$ 12.500,00',
  state: 'good',
  interpretation: 'Interpretação da liquidez.',
  influencers: { improves: ['Receber antes'], worsens: ['Antecipar despesas'] },
  connections: ['Crédito', 'Fluxo'],
  summarySentence: 'Liquidez sustentável para o horizonte curto.',
  hasGap: false,
  exploreHint: null,
};

describe('PillarCard', () => {
  it('renders question and horizon before the primary value in reading order', () => {
    const { container } = render(<PillarCard pillar={samplePillar} onExplore={() => undefined} />);

    expect(screen.getByRole('heading', { name: 'Liquidez' })).toBeInTheDocument();
    expect(screen.getByText('Boa')).toBeInTheDocument();
    expect(screen.getByText('Consigo operar agora e no horizonte curto?')).toBeInTheDocument();
    expect(screen.getByText('Horizonte curto')).toBeInTheDocument();
    expect(screen.getByText('R$ 12.500,00')).toBeInTheDocument();
    expect(screen.getByText('Caixa disponível')).toBeInTheDocument();
    expect(screen.getByText('Liquidez sustentável para o horizonte curto.')).toBeInTheDocument();

    const text = container.textContent ?? '';
    const questionIndex = text.indexOf('Consigo operar agora e no horizonte curto?');
    const valueIndex = text.indexOf('R$ 12.500,00');
    expect(questionIndex).toBeGreaterThanOrEqual(0);
    expect(valueIndex).toBeGreaterThan(questionIndex);
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

  it('uses a contextual explore CTA instead of a generic Continue', () => {
    const onExplore = vi.fn();
    render(<PillarCard pillar={samplePillar} onExplore={onExplore} />);

    fireEvent.click(screen.getByRole('button', { name: /Entender este pilar/i }));
    expect(onExplore).toHaveBeenCalledTimes(1);
  });
});
