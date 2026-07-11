import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DecisionAction, DecisionEngineStatus } from '@/services/decisionEngineService';
import { TestMemoryRouter } from '@/test/TestMemoryRouter';

import { DecisionPrimaryBlock } from './DecisionPrimaryBlock';

vi.mock('@/components/ui/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn() },
}));

const baseAction: DecisionAction = {
  title: 'Reduzir parcelas',
  description: 'Priorize a maior parcela primeiro.',
  impact: 'Até R$ 250/mês',
  reason: [],
};

function renderBlock(props: {
  readonly status?: DecisionEngineStatus;
  readonly primaryIssue?: string;
}) {
  const status = props.status ?? 'attention';
  const primaryIssue = props.primaryIssue ?? 'high_commitment';
  return render(
    <TestMemoryRouter>
      <DecisionPrimaryBlock
        action={baseAction}
        status={status}
        hasSecondarySteps
        problemHeadline="Compromisso alto"
        primaryIssue={primaryIssue}
      />
    </TestMemoryRouter>,
  );
}

describe('DecisionPrimaryBlock', () => {
  it('renders quick links for the primary issue', () => {
    renderBlock({ primaryIssue: 'high_commitment' });

    expect(screen.getByRole('link', { name: 'Ver transações' })).toHaveAttribute(
      'href',
      '/transactions',
    );
    expect(screen.getByRole('link', { name: 'Cartões' })).toHaveAttribute(
      'href',
      '/credit-cards-v2',
    );
  });

  it('falls back to data_incomplete links for unknown primary issue', () => {
    renderBlock({ primaryIssue: 'unknown_slug_xyz' });

    expect(screen.getByRole('link', { name: 'Ver transações' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Orçamento' })).toHaveAttribute('href', '/budget');
  });
});
