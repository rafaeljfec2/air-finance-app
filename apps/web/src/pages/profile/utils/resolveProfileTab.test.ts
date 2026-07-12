import { isProfileTab, resolveProfileTab, PROFILE_TABS } from './resolveProfileTab';

describe('resolveProfileTab', () => {
  it('returns personal for null, empty, or unknown tab', () => {
    expect(resolveProfileTab(null)).toBe('personal');
    expect(resolveProfileTab('')).toBe('personal');
    expect(resolveProfileTab('invalid')).toBe('personal');
  });

  it('returns canonical tabs unchanged', () => {
    for (const tab of PROFILE_TABS) {
      expect(resolveProfileTab(tab)).toBe(tab);
    }
  });

  it('maps notifications alias to preferences', () => {
    expect(resolveProfileTab('notifications')).toBe('preferences');
  });

  it('maps integrations and api-tokens aliases to developer', () => {
    expect(resolveProfileTab('integrations')).toBe('developer');
    expect(resolveProfileTab('api-tokens')).toBe('developer');
  });

  it('narrows canonical tab values with isProfileTab', () => {
    expect(isProfileTab('personal')).toBe(true);
    expect(isProfileTab('notifications')).toBe(false);
    expect(isProfileTab('developer')).toBe(true);
  });
});
