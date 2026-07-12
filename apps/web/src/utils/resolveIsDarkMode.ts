export type ThemePreference = 'light' | 'dark' | 'system';

export function resolveIsDarkMode(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): boolean {
  if (preference === 'dark') {
    return true;
  }
  if (preference === 'light') {
    return false;
  }
  return systemPrefersDark;
}
