import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { CompletePlanNumbers } from '@/services/completePlanService';

import { CompletePlanNumbersCard } from './CompletePlanNumbersCard';

const baseNumbers: CompletePlanNumbers = {
  netIncome: 27000,
  totalCommitted: 2943,
  committedPct: 0.109,
  healthyTargetPct: 0.25,
  reductionNeeded: 0,
};

describe('CompletePlanNumbersCard', () => {
  it('renders the committed percentage today and the healthy target', () => {
    render(<CompletePlanNumbersCard numbers={baseNumbers} />);

    expect(screen.getByText(/Hoje você compromete/i)).toBeInTheDocument();
    expect(screen.getByText(/Meta saudável/i)).toBeInTheDocument();
  });

  it('shows a legend that explains how the committed percentage is composed', () => {
    render(<CompletePlanNumbersCard numbers={baseNumbers} />);

    const legend = screen.getByTestId('committed-pct-legend');
    expect(legend.textContent).toMatch(/parcelas/i);
    expect(legend.textContent).toMatch(/cart[ãa]o|rotativo/i);
    expect(legend.textContent).toMatch(/cheque especial/i);
  });
});
