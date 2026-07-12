import { CreateUserSchema, UpdateUserInputSchema, type UpdateUserInput } from './userService';

describe('UpdateUserInputSchema', () => {
  it('keeps phone, location, bio and avatar on parse', () => {
    const input = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+55 11 99999-9999',
      location: 'São Paulo',
      bio: 'Finance enthusiast',
      avatar: 'data:image/png;base64,abc',
    };

    const parsed = UpdateUserInputSchema.parse(input);

    expect(parsed.phone).toBe(input.phone);
    expect(parsed.location).toBe(input.location);
    expect(parsed.bio).toBe(input.bio);
    expect(parsed.avatar).toBe(input.avatar);
  });

  it('keeps openaiApiKey inside integrations and strips client hasOpenaiKey', () => {
    const input = {
      integrations: {
        openaiApiKey: 'sk-test-key',
        openaiModel: 'gpt-4o-mini' as const,
        hasOpenaiKey: true,
      },
    };

    const parsed = UpdateUserInputSchema.parse(input);

    expect(parsed.integrations?.openaiApiKey).toBe('sk-test-key');
    expect(parsed.integrations?.openaiModel).toBe('gpt-4o-mini');
    expect(parsed.integrations).not.toHaveProperty('hasOpenaiKey');
  });

  it('rejects avatar data URLs above the size budget', () => {
    const result = UpdateUserInputSchema.safeParse({
      avatar: `data:image/png;base64,${'a'.repeat(700_001)}`,
    });

    expect(result.success).toBe(false);
  });

  it('strips unknown top-level keys (zod object default)', () => {
    const parsed = UpdateUserInputSchema.parse({
      name: 'Jane',
      unexpected: 'nope',
    });

    expect(parsed).toEqual({ name: 'Jane' });
    expect('unexpected' in parsed).toBe(false);
  });
});

describe('CreateUserSchema vs UpdateUserInputSchema', () => {
  it('both schemas keep profile fields used by update flows', () => {
    const profileFields = {
      phone: '+55',
      location: 'BR',
      bio: 'bio',
      avatar: 'https://cdn.example/a.png',
    };

    const createParsed = CreateUserSchema.partial().parse({
      name: 'Jane',
      ...profileFields,
    });
    const updateParsed = UpdateUserInputSchema.parse({
      name: 'Jane',
      ...profileFields,
    });

    expect(createParsed.phone).toBe('+55');
    expect(updateParsed.phone).toBe('+55');
    expect(updateParsed.avatar).toBe('https://cdn.example/a.png');
  });
});

describe('UpdateUserInput type', () => {
  it('allows partial profile updates at type level', () => {
    const payload: UpdateUserInput = {
      phone: '123',
      integrations: { openaiApiKey: 'sk-x' },
    };
    expect(payload.phone).toBe('123');
  });
});
