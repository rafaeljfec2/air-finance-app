import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { CompletePlanNumbers } from '@/services/completePlanService';

import { CompletePlanNumbersCard } from './CompletePlanNumbersCard';
import { COMPLETE_PLAN_LABELS } from './copy';

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

  it('attaches hover info hints for each KPI', () => {
    render(<CompletePlanNumbersCard numbers={baseNumbers} />);

    expect(screen.getByTestId('committed-pct-legend')).toHaveAttribute(
      'aria-label',
      COMPLETE_PLAN_LABELS.numbersInfoToggle,
    );
    expect(screen.getByTestId('healthy-target-legend')).toHaveAttribute(
      'aria-label',
      COMPLETE_PLAN_LABELS.numbersInfoToggle,
    );
    expect(screen.getByTestId('reduction-needed-legend')).toHaveAttribute(
      'aria-label',
      COMPLETE_PLAN_LABELS.numbersInfoToggle,
    );
  });
});
