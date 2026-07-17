import { describe, expect, it } from 'vitest';

import { buildPeriodReadingProjectionMilestones } from './buildPeriodReadingProjectionMilestones';

describe('buildPeriodReadingProjectionMilestones', () => {
  it('builds today plus 30/60/90 milestones', () => {
    const milestones = buildPeriodReadingProjectionMilestones({
      todayCommittedPct: 0.48,
      todayTotalCommitted: 5365.9,
      projection: {
        in30Days: { totalCommitted: 5000, committedPct: 0.4, installmentsEnding: 0 },
        in60Days: { totalCommitted: 4500, committedPct: 0.35, installmentsEnding: 1 },
        in90Days: { totalCommitted: 2655.81, committedPct: 0.2, installmentsEnding: 2 },
        ifNoChange: 'x',
      },
    });

    expect(milestones.map((item) => item.id)).toEqual(['today', 'd30', 'd60', 'd90']);
    expect(milestones[3].committedPct).toBe(0.2);
  });
});
