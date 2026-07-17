import { describe, expect, it } from 'vitest';

import type { CapacityState, PillarId } from '../types';
import { PILLAR_ORDER } from '../types';

import { getPillarTemplate } from './pillarInterpretationTemplates';

const STATES: readonly CapacityState[] = [
  'excellent',
  'good',
  'attention',
  'critical',
  'inconclusive',
];

describe('getPillarTemplate', () => {
  it('returns human interpretation for every pillar and state without jargon', () => {
    for (const pillarId of PILLAR_ORDER) {
      for (const state of STATES) {
        const block = getPillarTemplate(pillarId as PillarId, state);
        const blob = [
          block.interpretation,
          block.summarySentence,
          ...block.improves,
          ...block.worsens,
        ].join(' ');

        expect(block.interpretation.trim().length).toBeGreaterThan(0);
        expect(block.summarySentence.trim().length).toBeGreaterThan(0);
        expect(blob).not.toMatch(/\bproxy\b/i);
        expect(blob).not.toMatch(/\brunway\b/i);
        expect(blob).not.toMatch(/\bFIN-\d+/i);
      }
    }
  });
});
