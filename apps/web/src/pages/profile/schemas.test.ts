import {
  CreateApiTokenFormSchema,
  ProfileIntegrationsSchema,
  ProfilePersonalSchema,
  ProfilePreferencesSchema,
} from './schemas';

describe('profile schemas', () => {
  it('accepts a valid personal profile payload', () => {
    const parsed = ProfilePersonalSchema.parse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '',
      location: 'SP',
      bio: '',
    });
    expect(parsed.name).toBe('Jane Doe');
  });

  it('rejects invalid personal email', () => {
    const result = ProfilePersonalSchema.safeParse({
      name: 'Jane',
      email: 'not-an-email',
      phone: '',
      location: '',
      bio: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts preferences and integrations payloads', () => {
    expect(
      ProfilePreferencesSchema.parse({
        currency: 'BRL',
        language: 'pt-BR',
        theme: 'system',
        dateFormat: 'DD/MM/YYYY',
      }).theme,
    ).toBe('system');

    expect(
      ProfileIntegrationsSchema.parse({
        openaiApiKey: 'sk-test',
        openaiModel: 'gpt-4o-mini',
        hasOpenaiKey: false,
      }).openaiModel,
    ).toBe('gpt-4o-mini');
  });

  it('requires token name for create token form', () => {
    expect(CreateApiTokenFormSchema.safeParse({ name: '  ', expiration: '90d' }).success).toBe(
      false,
    );
    expect(CreateApiTokenFormSchema.parse({ name: 'CI Token', expiration: '1y' }).name).toBe(
      'CI Token',
    );
  });
});
