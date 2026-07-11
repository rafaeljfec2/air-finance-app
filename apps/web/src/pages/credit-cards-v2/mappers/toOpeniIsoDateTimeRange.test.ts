import { describe, expect, it } from 'vitest';

import { toOpeniIsoDateTimeRange } from './toOpeniIsoDateTimeRange';

describe('toOpeniIsoDateTimeRange', () => {
  it('converts date-only strings to start/end of day ISO datetime', () => {
    expect(toOpeniIsoDateTimeRange('2026-06-12', '2026-07-11')).toEqual({
      startDate: '2026-06-12T00:00:00.000Z',
      endDate: '2026-07-11T23:59:59.999Z',
    });
  });

  it('keeps already-ISO start/end values stable for the date portion', () => {
    expect(toOpeniIsoDateTimeRange('2026-06-12T10:00:00.000Z', '2026-07-11T15:30:00.000Z')).toEqual(
      {
        startDate: '2026-06-12T00:00:00.000Z',
        endDate: '2026-07-11T23:59:59.999Z',
      },
    );
  });
});
