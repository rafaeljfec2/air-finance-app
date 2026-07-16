import { describe, expect, it } from 'vitest';

import { classifyTransactionVisualWeight } from './classifyTransactionVisualWeight';

describe('classifyTransactionVisualWeight', () => {
  it('marks micro transactions below threshold', () => {
    expect(classifyTransactionVisualWeight(25)).toBe('micro');
    expect(classifyTransactionVisualWeight(99.99)).toBe('micro');
  });

  it('marks standard transactions in the middle range', () => {
    expect(classifyTransactionVisualWeight(100)).toBe('standard');
    expect(classifyTransactionVisualWeight(499)).toBe('standard');
  });

  it('marks relevant transactions at or above relevance threshold', () => {
    expect(classifyTransactionVisualWeight(500)).toBe('relevant');
    expect(classifyTransactionVisualWeight(1200)).toBe('relevant');
  });
});
