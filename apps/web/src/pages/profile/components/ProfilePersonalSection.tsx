import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mail, MapPin, Phone, Save, User, X } from 'lucide-react';

interface ProfilePersonalSectionProps {
  readonly formData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  readonly avatar: string;
  readonly userId?: string;
  readonly isEditing: boolean;
  readonly isSaving: boolean;
  readonly onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly onStartEditing: () => void;
}

export function ProfilePersonalSection({
  formData,
  avatar,
  userId,
  isEditing,
  isSaving,
  onFormChange,
  onAvatarChange,
  onSave,
  onCancel,
  onStartEditing,
}: ProfilePersonalSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="destructive" onClick={onCancel} disabled={isSaving} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button variant="success" onClick={onSave} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={onStartEditing}
            className="gap-2 bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-400 dark:hover:bg-primary-500 dark:text-background font-semibold shadow focus:ring-2 focus:ring-primary-300 focus:outline-none transition-colors"
          >
            Editar Perfil
          </Button>
        )}
      </div>

      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center justify-center gap-3 min-w-[8rem]">
              <div className="relative flex items-center justify-center">
                {avatar && avatar !== '/avatars/default.png' ? (
                  <img
                    src={avatar}
                    alt={formData.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-border dark:border-border-dark"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/avatars/default.png') {
                        target.src = '/avatars/default.png';
                      }
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-border dark:border-border-dark flex items-center justify-center">
                    <User className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </label>
                )}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={onAvatarChange}
                  disabled={!isEditing}
                />
              </div>
              <p className="text-sm font-medium text-text dark:text-text-dark">{formData.name}</p>
              {userId && <p className="text-xs text-gray-500 dark:text-gray-400">ID: {userId}</p>}
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                  >
                    Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onFormChange}
                      disabled={!isEditing}
                      className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onFormChange}
                      disabled={!isEditing}
                      className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                  >
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onFormChange}
                      disabled={!isEditing}
                      className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                  >
                    Localização
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={onFormChange}
                      disabled={!isEditing}
                      className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                >
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={onFormChange}
                  disabled={!isEditing}
                  rows={3}
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
