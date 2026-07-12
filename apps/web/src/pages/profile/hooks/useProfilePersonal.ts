import React, { useState, useCallback } from 'react';

import { toast } from '@/components/ui/toast';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';

import type { ProfilePersonalFormValues } from '../schemas';
import {
  readFileAsDataUrl,
  validateAvatarDataUrl,
  validateAvatarFile,
} from '../utils/validateAvatarFile';

import type { ProfileFormData } from './types';

interface UseProfilePersonalParams {
  readonly profileData: ProfileFormData;
  readonly setProfileData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  readonly avatar: string;
  readonly setAvatar: React.Dispatch<React.SetStateAction<string>>;
}

interface UseProfilePersonalReturn {
  readonly isEditing: boolean;
  readonly isSaving: boolean;
  readonly handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleSave: (values?: ProfilePersonalFormValues) => Promise<void>;
  readonly handleCancel: () => void;
  readonly startEditing: () => void;
}

export function useProfilePersonal({
  profileData,
  setProfileData,
  avatar,
  setAvatar,
}: UseProfilePersonalParams): UseProfilePersonalReturn {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileFormData>(profileData);
  const [originalAvatar, setOriginalAvatar] = useState(avatar);

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validationError = validateAvatarFile(file);
      if (validationError) {
        toast({
          title: 'Erro',
          description: validationError,
          type: 'error',
        });
        e.target.value = '';
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        setAvatar(dataUrl);
      } catch (error) {
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao carregar o avatar',
          type: 'error',
        });
      }
    },
    [setAvatar],
  );

  const handleSave = useCallback(
    async (values?: ProfilePersonalFormValues) => {
      if (!user?.id) return;

      const avatarError = validateAvatarDataUrl(avatar);
      if (avatarError) {
        toast({
          title: 'Erro',
          description: avatarError,
          type: 'error',
        });
        return;
      }

      const data = values ?? profileData;
      setIsSaving(true);
      try {
        const updatedUser = await updateUser(user.id, {
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
          avatar,
        });
        setUser(mapUserServiceToUserType(updatedUser));
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
        });
        setIsEditing(false);
        setOriginalData({
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
        });
        setOriginalAvatar(updatedUser.avatar ?? avatar);
        if (updatedUser.avatar) {
          setAvatar(updatedUser.avatar);
        }
        toast({
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso!',
          type: 'success',
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar perfil',
          type: 'error',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id, profileData, avatar, setUser, setProfileData, setAvatar],
  );

  const handleCancel = useCallback(() => {
    setProfileData(originalData);
    setAvatar(originalAvatar);
    setIsEditing(false);
  }, [originalData, originalAvatar, setProfileData, setAvatar]);

  const startEditing = useCallback(() => {
    setOriginalData(profileData);
    setOriginalAvatar(avatar);
    setIsEditing(true);
  }, [profileData, avatar]);

  return {
    isEditing,
    isSaving,
    handleAvatarChange,
    handleSave,
    handleCancel,
    startEditing,
  };
}
