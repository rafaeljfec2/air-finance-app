import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CompletePlanCoherenceNote } from './CompletePlanCoherenceNote';

describe('CompletePlanCoherenceNote', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when text is empty', () => {
    const { container } = render(<CompletePlanCoherenceNote text="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when text is only whitespace', () => {
    const onlyWhitespace = `${'   '}\n\t`;
    render(<CompletePlanCoherenceNote text={onlyWhitespace} />);
    expect(screen.queryByRole('heading', { name: /leitura dos números/i })).not.toBeInTheDocument();
  });

  it('renders heading and trimmed body text', () => {
    render(<CompletePlanCoherenceNote text="  Compromisso em 11% da renda. " />);

    expect(screen.getByRole('heading', { name: /leitura dos números/i })).toBeInTheDocument();
    expect(screen.getByText('Compromisso em 11% da renda.')).toBeInTheDocument();
  });
});
