import React, { useState, useCallback } from 'react';

import { toast } from '@/components/ui/toast';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';

import type { ProfileIntegrationsFormValues } from '../schemas';

import { buildIntegrationsUpdatePayload } from './buildIntegrationsUpdatePayload';
import type { IntegrationsData } from './types';

interface UseProfileIntegrationsParams {
  readonly integrations: IntegrationsData;
  readonly setIntegrations: React.Dispatch<React.SetStateAction<IntegrationsData>>;
}

interface UseProfileIntegrationsReturn {
  readonly isSaving: boolean;
  readonly handleChange: (key: keyof IntegrationsData, value: string | boolean) => void;
  readonly handleSave: (values?: ProfileIntegrationsFormValues) => Promise<void>;
}

export function useProfileIntegrations({
  integrations,
  setIntegrations,
}: UseProfileIntegrationsParams): UseProfileIntegrationsReturn {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (key: keyof IntegrationsData, value: string | boolean) => {
      setIntegrations((prev) => ({ ...prev, [key]: value }));
    },
    [setIntegrations],
  );

  const handleSave = useCallback(
    async (values?: ProfileIntegrationsFormValues) => {
      if (!user?.id) return;

      const payload = values ?? integrations;
      setIsSaving(true);
      try {
        const updatedUser = await updateUser(user.id, buildIntegrationsUpdatePayload(payload));
        setUser(mapUserServiceToUserType(updatedUser));
        setIntegrations({
          ...payload,
          openaiApiKey: '',
          hasOpenaiKey:
            Boolean(updatedUser.integrations?.hasOpenaiKey) || Boolean(payload.openaiApiKey.trim()),
        });
        toast({
          title: 'Sucesso',
          description: 'Integrações atualizadas com sucesso!',
          type: 'success',
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar integrações',
          type: 'error',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id, integrations, setUser, setIntegrations],
  );

  return {
    isSaving,
    handleChange,
    handleSave,
  };
}
