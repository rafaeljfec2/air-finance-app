import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CompletePlanInfoHint } from './CompletePlanInfoHint';

describe('CompletePlanInfoHint', () => {
  it('renders an accessible hover trigger for the explanation', () => {
    render(
      <CompletePlanInfoHint
        ariaLabel="Por que esse valor?"
        content="Texto de ajuda do KPI"
        testId="info-hint"
      />,
    );

    const trigger = screen.getByTestId('info-hint');
    expect(trigger).toHaveAttribute('aria-label', 'Por que esse valor?');
    expect(trigger.tagName).toBe('BUTTON');
  });
});
