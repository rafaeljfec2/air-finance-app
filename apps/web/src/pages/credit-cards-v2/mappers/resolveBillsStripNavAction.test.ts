import { describe, expect, it } from 'vitest';

import { resolveBillsStripNavAction } from './resolveBillsStripNavAction';

describe('resolveBillsStripNavAction', () => {
  it('returns step on the first click', () => {
    expect(
      resolveBillsStripNavAction({
        direction: 'right',
        now: 1000,
        lastClick: null,
      }),
    ).toEqual({
      action: 'step',
      nextLastClick: { direction: 'right', at: 1000 },
    });
  });

  it('returns edge jump on a second click within the double-tap window', () => {
    expect(
      resolveBillsStripNavAction({
        direction: 'right',
        now: 1200,
        lastClick: { direction: 'right', at: 1000 },
        doubleTapMs: 350,
      }),
    ).toEqual({
      action: 'edge',
      nextLastClick: null,
    });
  });

  it('returns step when the second click is outside the double-tap window', () => {
    expect(
      resolveBillsStripNavAction({
        direction: 'left',
        now: 2000,
        lastClick: { direction: 'left', at: 1000 },
        doubleTapMs: 350,
      }),
    ).toEqual({
      action: 'step',
      nextLastClick: { direction: 'left', at: 2000 },
    });
  });

  it('returns step when directions differ', () => {
    expect(
      resolveBillsStripNavAction({
        direction: 'left',
        now: 1100,
        lastClick: { direction: 'right', at: 1000 },
      }),
    ).toEqual({
      action: 'step',
      nextLastClick: { direction: 'left', at: 1100 },
    });
  });
});
