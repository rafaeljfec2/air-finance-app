import { describe, expect, it } from 'vitest';

import {
  buildImprovementBannerText,
  buildPeriodReadingHeadline,
  shouldShowImprovementBanner,
} from './buildPeriodReadingHeroNarrative';

describe('buildPeriodReadingHeadline', () => {
  it('maps high_commitment without guilt wording', () => {
    const headline = buildPeriodReadingHeadline('high_commitment');
    expect(headline.lead).toMatch(/renda/i);
    expect(headline.emphasis.toLowerCase()).not.toMatch(/fracasso|culpa|errado/);
  });

  it('falls back for unknown issues', () => {
    expect(buildPeriodReadingHeadline('unknown_thing').lead.length).toBeGreaterThan(0);
  });
});

describe('shouldShowImprovementBanner', () => {
  it('shows only when 90-day committed pct improves', () => {
    expect(
      shouldShowImprovementBanner({ todayCommittedPct: 0.48, in90DaysCommittedPct: 0.2 }),
    ).toBe(true);
    expect(shouldShowImprovementBanner({ todayCommittedPct: 0.2, in90DaysCommittedPct: 0.2 })).toBe(
      false,
    );
    expect(shouldShowImprovementBanner({ todayCommittedPct: 0.2, in90DaysCommittedPct: 0.3 })).toBe(
      false,
    );
  });
});

describe('buildImprovementBannerText', () => {
  it('returns null for empty outcome', () => {
    expect(buildImprovementBannerText('   ')).toBeNull();
  });

  it('returns trimmed outcome text', () => {
    expect(buildImprovementBannerText('  Folga sobe.  ')).toBe('Folga sobe.');
  });
});
