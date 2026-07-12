import { describe, expect, it } from 'vitest';

import { buildIntegrationsUpdatePayload } from './buildIntegrationsUpdatePayload';

describe('buildIntegrationsUpdatePayload', () => {
  it('omits empty openaiApiKey and never sends hasOpenaiKey', () => {
    const payload = buildIntegrationsUpdatePayload({
      openaiApiKey: '',
      openaiModel: 'gpt-4o',
      hasOpenaiKey: true,
    });

    expect(payload).toEqual({
      integrations: {
        openaiModel: 'gpt-4o',
      },
    });
    expect(payload.integrations).not.toHaveProperty('openaiApiKey');
    expect(payload.integrations).not.toHaveProperty('hasOpenaiKey');
  });

  it('includes openaiApiKey when provided', () => {
    const payload = buildIntegrationsUpdatePayload({
      openaiApiKey: 'sk-new',
      openaiModel: 'gpt-4o-mini',
      hasOpenaiKey: false,
    });

    expect(payload).toEqual({
      integrations: {
        openaiApiKey: 'sk-new',
        openaiModel: 'gpt-4o-mini',
      },
    });
  });
});
