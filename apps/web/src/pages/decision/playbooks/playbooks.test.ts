import { describe, expect, it } from 'vitest';

import type { PhaseContent, PlaybookSlug } from './types';

import { ALL_PLAYBOOKS, getPlaybook } from './index';

const REQUIRED_SLUGS: readonly PlaybookSlug[] = [
  'liquidity_risk',
  'debt_pressure',
  'credit_overuse',
  'high_commitment',
  'low_surplus',
  'low_savings',
  'high_fixed_cost',
  'healthy',
  'data_incomplete',
];

const FORBIDDEN_TERMS = ['KPI', 'índice', 'taxa de', 'rotativo', 'severity', 'snapshot'];

function assertPhaseContent(phase: PhaseContent, slug: string, name: string): void {
  expect(phase.headline.trim().length, `${slug}/${name}.headline`).toBeGreaterThan(0);
  expect(phase.objective.trim().length, `${slug}/${name}.objective`).toBeGreaterThan(0);
  expect(
    phase.actions.length,
    `${slug}/${name}.actions length must be 3..5`,
  ).toBeGreaterThanOrEqual(3);
  expect(phase.actions.length, `${slug}/${name}.actions length must be 3..5`).toBeLessThanOrEqual(
    5,
  );
  for (const action of phase.actions) {
    expect(action.trim().length, `${slug}/${name} empty action`).toBeGreaterThan(0);
  }
}

function collectStrings(...values: readonly string[]): string {
  return values.join(' ');
}

describe('playbooks catalog', () => {
  it('exposes a playbook for every required slug', () => {
    const slugs = ALL_PLAYBOOKS.map((p) => p.slug).sort();
    expect(slugs).toEqual([...REQUIRED_SLUGS].sort());
  });

  for (const slug of REQUIRED_SLUGS) {
    describe(slug, () => {
      const playbook = getPlaybook(slug);

      it('has non-empty title, explanation, rule and expectedImpact', () => {
        expect(playbook.title.trim().length).toBeGreaterThan(0);
        expect(playbook.explanation.trim().length).toBeGreaterThan(0);
        expect(playbook.rule.trim().length).toBeGreaterThan(0);
        expect(playbook.expectedImpact.trim().length).toBeGreaterThan(0);
      });

      it('has 3 to 5 actions in each phase (red, yellow, green)', () => {
        assertPhaseContent(playbook.phases.red, slug, 'red');
        assertPhaseContent(playbook.phases.yellow, slug, 'yellow');
        assertPhaseContent(playbook.phases.green, slug, 'green');
      });

      it('avoids technical jargon', () => {
        const text = collectStrings(
          playbook.title,
          playbook.explanation,
          playbook.rule,
          playbook.expectedImpact,
          ...Object.values(playbook.phases).flatMap((p) => [p.headline, p.objective, ...p.actions]),
        );
        for (const term of FORBIDDEN_TERMS) {
          expect(text.toLowerCase()).not.toContain(term.toLowerCase());
        }
      });
    });
  }

  it('falls back to healthy playbook for unknown slug', () => {
    const fallback = getPlaybook('unknown_slug_xyz');
    expect(fallback.slug).toBe('healthy');
  });
});
