import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DecisionPageToolbar } from './DecisionPageToolbar';

describe('DecisionPageToolbar', () => {
  it('renders title, subtitle, decorative icon, and forwards refresh', () => {
    const onRefresh = vi.fn();
    const { container } = render(
      <DecisionPageToolbar
        title="Leitura do período"
        subtitle="Subtítulo."
        showRefresh
        isFetching={false}
        onRefresh={onRefresh}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Leitura do período' })).toBeInTheDocument();
    expect(screen.getByText('Subtítulo.')).toBeInTheDocument();
    expect(container.querySelector('header svg')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Atualizar/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renders actions next to the refresh button when provided', () => {
    render(
      <DecisionPageToolbar
        title="T"
        subtitle="S"
        showRefresh
        isFetching={false}
        onRefresh={vi.fn()}
        actions={<button type="button">Período</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Período' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Atualizar/i })).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <DecisionPageToolbar
        title="T"
        subtitle="S"
        showRefresh={false}
        isFetching={false}
        onRefresh={vi.fn()}
      >
        <p>Child block</p>
      </DecisionPageToolbar>,
    );
    expect(screen.getByText('Child block')).toBeInTheDocument();
  });
});
