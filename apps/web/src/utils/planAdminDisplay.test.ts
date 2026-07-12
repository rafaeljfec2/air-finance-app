import { formatPlanDisplayName, formatPlanLimit, formatPlanCapability } from './planAdminDisplay';

describe('planAdminDisplay', () => {
  describe('formatPlanDisplayName', () => {
    it('maps known plan slugs to readable labels', () => {
      expect(formatPlanDisplayName('free')).toBe('Free');
      expect(formatPlanDisplayName('starter')).toBe('Starter');
      expect(formatPlanDisplayName('pro')).toBe('Pro');
      expect(formatPlanDisplayName('business')).toBe('Business');
      expect(formatPlanDisplayName('open_banking')).toBe('Open Banking');
    });

    it('replaces underscores for unknown slugs', () => {
      expect(formatPlanDisplayName('custom_plan')).toBe('Custom plan');
    });
  });

  describe('formatPlanLimit', () => {
    it('returns Ilimitado for -1 with gender-aware label', () => {
      expect(formatPlanLimit(-1, 'feminine')).toBe('Ilimitadas');
      expect(formatPlanLimit(-1, 'masculine')).toBe('Ilimitados');
    });

    it('returns the numeric value for finite limits', () => {
      expect(formatPlanLimit(2, 'feminine')).toBe('2');
      expect(formatPlanLimit(0, 'masculine')).toBe('0');
    });
  });

  describe('formatPlanCapability', () => {
    it('returns enabled and disabled labels', () => {
      expect(formatPlanCapability(true)).toBe('Sim');
      expect(formatPlanCapability(false)).toBe('Não');
      expect(formatPlanCapability(true, { enabled: 'Habilitada', disabled: 'Desabilitada' })).toBe(
        'Habilitada',
      );
    });
  });
});
