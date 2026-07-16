import { describe, expect, it } from 'vitest';

import { buildReceptionGreeting, resolveDayPeriod, resolveFirstName } from './greeting';

describe('greeting helpers', () => {
  it('extracts the first name', () => {
    expect(resolveFirstName('Rafael Silva')).toBe('Rafael');
    expect(resolveFirstName('  Ana  ')).toBe('Ana');
    expect(resolveFirstName(null)).toBe('');
  });

  it('resolves day period by hour', () => {
    expect(resolveDayPeriod(new Date('2026-07-14T08:00:00'))).toBe('morning');
    expect(resolveDayPeriod(new Date('2026-07-14T14:00:00'))).toBe('afternoon');
    expect(resolveDayPeriod(new Date('2026-07-14T20:00:00'))).toBe('evening');
  });

  it('builds a human reception greeting', () => {
    expect(buildReceptionGreeting('Rafael', new Date('2026-07-14T21:00:00'))).toBe(
      'Boa noite, Rafael.',
    );
    expect(buildReceptionGreeting(undefined, new Date('2026-07-14T09:00:00'))).toBe('Bom dia.');
  });
});
