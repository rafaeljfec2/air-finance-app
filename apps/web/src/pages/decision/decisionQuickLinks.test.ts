import { describe, expect, it } from 'vitest';

import { decisionQuickLinksForIssue } from './decisionQuickLinks';

describe('decisionQuickLinksForIssue', () => {
  it('returns credit and transactions for credit_overuse', () => {
    const links = decisionQuickLinksForIssue('credit_overuse');
    expect(links.map((l) => l.href)).toEqual(['/credit-cards', '/transactions']);
  });

  it('falls back for unknown slug', () => {
    const links = decisionQuickLinksForIssue('unknown_slug');
    expect(links[0]?.href).toBe('/transactions');
  });
});
