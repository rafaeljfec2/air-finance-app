import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProjectedInstallmentsModal } from './ProjectedInstallmentsModal';

describe('ProjectedInstallmentsModal', () => {
  it('lists projected installments and totals', () => {
    const onClose = vi.fn();
    render(
      <ProjectedInstallmentsModal
        open
        cardName="ultraviolet+black"
        projectedAmount={514.7}
        cycleAmount={50}
        totalEstimated={564.7}
        installments={[
          {
            id: 'p1',
            description: 'Mapfre Seguros',
            amount: 514.7,
            installmentLabel: '7/12',
            purchaseDate: '2026-05-30',
          },
        ]}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Parcelas projetadas neste mês')).toBeInTheDocument();
    expect(screen.getByText('Mapfre Seguros')).toBeInTheDocument();
    expect(screen.getByText('Parcela 7/12')).toBeInTheDocument();
    expect(screen.getByText(/1 parcela/i)).toBeInTheDocument();
  });

  it('shows empty state when there are no projected installments', () => {
    render(
      <ProjectedInstallmentsModal
        open
        cardName="Card"
        projectedAmount={0}
        cycleAmount={100}
        totalEstimated={100}
        installments={[]}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Nenhuma parcela futura estimada para este ciclo.'),
    ).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { container } = render(
      <ProjectedInstallmentsModal
        open={false}
        cardName="Card"
        projectedAmount={0}
        cycleAmount={0}
        totalEstimated={0}
        installments={[]}
        onClose={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
