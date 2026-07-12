import { resolveIsDarkMode, type ThemePreference } from './resolveIsDarkMode';

describe('resolveIsDarkMode', () => {
  it('returns true for dark preference regardless of system', () => {
    expect(resolveIsDarkMode('dark', false)).toBe(true);
    expect(resolveIsDarkMode('dark', true)).toBe(true);
  });

  it('returns false for light preference regardless of system', () => {
    expect(resolveIsDarkMode('light', false)).toBe(false);
    expect(resolveIsDarkMode('light', true)).toBe(false);
  });

  it('follows system preference when preference is system', () => {
    expect(resolveIsDarkMode('system', true)).toBe(true);
    expect(resolveIsDarkMode('system', false)).toBe(false);
  });

  it('accepts ThemePreference union', () => {
    const prefs: ThemePreference[] = ['light', 'dark', 'system'];
    expect(prefs).toHaveLength(3);
  });
});
