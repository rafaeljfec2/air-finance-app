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

  it('frames data_incomplete as hygiene to enable reading, not today decision', () => {
    renderBlock({ primaryIssue: 'data_incomplete' });

    expect(screen.getByText(/Para habilitar a leitura/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Copiar lembrete de cadastro/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
    expect(screen.queryByText(/^Próximo passo$/i)).not.toBeInTheDocument();
  });
});
