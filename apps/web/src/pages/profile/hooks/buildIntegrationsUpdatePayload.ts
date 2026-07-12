import type { UpdateUserInput } from '@/services/userService';

import type { ProfileIntegrationsFormValues } from '../schemas';

export function buildIntegrationsUpdatePayload(
  payload: ProfileIntegrationsFormValues,
): Pick<UpdateUserInput, 'integrations'> {
  const integrations: NonNullable<UpdateUserInput['integrations']> = {
    openaiModel: payload.openaiModel,
  };

  const trimmedKey = payload.openaiApiKey.trim();
  if (trimmedKey.length > 0) {
    integrations.openaiApiKey = trimmedKey;
  }

  return { integrations };
}
