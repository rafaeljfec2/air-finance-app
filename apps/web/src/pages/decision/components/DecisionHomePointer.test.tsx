import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TestMemoryRouter } from '@/test/TestMemoryRouter';

import { DecisionHomePointer } from './DecisionHomePointer';

describe('DecisionHomePointer', () => {
  it('points the user to Home for todays decision', () => {
    render(
      <TestMemoryRouter>
        <DecisionHomePointer />
      </TestMemoryRouter>,
    );

    expect(screen.getByText(/A decisão de hoje está na Home/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ir para o parecer de hoje/i })).toHaveAttribute(
      'href',
      '/home',
    );
  });
});
