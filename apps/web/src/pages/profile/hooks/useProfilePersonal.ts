import React, { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast';
import { updateUser, type CreateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';
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
  readonly handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleSave: () => Promise<void>;
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

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfileData((prev) => ({ ...prev, [name]: value }));
    },
    [setProfileData],
  );

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao fazer upload do avatar',
          type: 'error',
        });
      }
    },
    [setAvatar],
  );

  const handleSave = useCallback(async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const updateData: Partial<CreateUser> & Record<string, unknown> = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
      };

      const updatedUser = await updateUser(user.id, updateData);
      setUser(mapUserServiceToUserType(updatedUser));
      setIsEditing(false);
      setOriginalData(profileData);
      setOriginalAvatar(avatar);
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
  }, [user?.id, profileData, avatar, setUser]);

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
    handleFormChange,
    handleAvatarChange,
    handleSave,
    handleCancel,
    startEditing,
  };
}
