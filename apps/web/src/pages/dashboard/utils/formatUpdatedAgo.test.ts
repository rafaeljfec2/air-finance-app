import { describe, expect, it } from 'vitest';

import { formatUpdatedAgo } from './formatUpdatedAgo';

const NOW = new Date('2026-07-16T12:00:00Z').getTime();

describe('formatUpdatedAgo', () => {
  it('returns null when timestamp is missing or zero', () => {
    expect(formatUpdatedAgo(0, NOW)).toBeNull();
  });

  it('formats moments ago for less than a minute', () => {
    expect(formatUpdatedAgo(NOW - 20 * 1000, NOW)).toBe('Dados atualizados agora mesmo');
  });

  it('formats minutes ago', () => {
    expect(formatUpdatedAgo(NOW - 60 * 1000, NOW)).toBe('Dados atualizados há 1 minuto');
    expect(formatUpdatedAgo(NOW - 12 * 60 * 1000, NOW)).toBe('Dados atualizados há 12 minutos');
  });

  it('formats hours ago', () => {
    expect(formatUpdatedAgo(NOW - 60 * 60 * 1000, NOW)).toBe('Dados atualizados há 1 hora');
    expect(formatUpdatedAgo(NOW - 2 * 60 * 60 * 1000, NOW)).toBe('Dados atualizados há 2 horas');
  });

  it('formats days ago beyond 24 hours', () => {
    expect(formatUpdatedAgo(NOW - 26 * 60 * 60 * 1000, NOW)).toBe('Dados atualizados há 1 dia');
    expect(formatUpdatedAgo(NOW - 3 * 24 * 60 * 60 * 1000, NOW)).toBe(
      'Dados atualizados há 3 dias',
    );
  });
});
