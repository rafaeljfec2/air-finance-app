import { describe, expect, it } from 'vitest';

import { formatDueDatePt, pickNextPendingReceivable } from './pickNextPendingReceivable';

describe('pickNextPendingReceivable', () => {
  it('returns the earliest pending by due date', () => {
    const next = pickNextPendingReceivable([
      {
        id: '2',
        description: 'Later',
        value: 100,
        dueDate: '2026-07-25',
        status: 'PENDING',
      },
      {
        id: '1',
        description: 'OUTSERA',
        value: 21751.2,
        dueDate: '2026-07-20',
        status: 'PENDING',
      },
      {
        id: '3',
        description: 'Paid',
        value: 50,
        dueDate: '2026-07-10',
        status: 'RECEIVED',
      },
    ]);

    expect(next).toEqual({
      description: 'OUTSERA',
      value: 21751.2,
      dueDate: '2026-07-20',
    });
  });

  it('returns null when there is no pending receivable', () => {
    expect(pickNextPendingReceivable([])).toBeNull();
  });
});

describe('formatDueDatePt', () => {
  it('formats ISO date in Portuguese', () => {
    expect(formatDueDatePt('2026-07-20')).toBe('dia 20 de julho');
  });
});
