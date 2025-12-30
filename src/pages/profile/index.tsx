import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getCurrentUser } from '@/services/authService';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import {
    Camera,
    Edit2,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

export function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, setIsLoadingUser] = useState(false);
  const [fullUserData, setFullUserData] = useState<typeof user | null>(null);
  const [avatar, setAvatar] = useState(user?.avatar || '/avatars/default.png');

  // Fetch full user data from server (includes email and other sensitive fields)
  useEffect(() => {
    const fetchFullUserData = async () => {
      if (!user?.id) return;

      setIsLoadingUser(true);
      try {
        const fullUser = await getCurrentUser();
        setFullUserData(fullUser);
      } catch (error) {
        console.error('Error fetching full user data:', error);
        // Fallback to stored user data
        setFullUserData(user);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchFullUserData();
  }, [user?.id]);

  const displayUser = fullUserData || user;

  const [formData, setFormData] = useState<ProfileFormData>({
    name: displayUser?.name || '',
    email: displayUser?.email || '',
    phone: displayUser?.phone || '',
    location: displayUser?.location || '',
    bio: displayUser?.bio || '',
  });

  // Update form data when full user data is loaded
  useEffect(() => {
    if (fullUserData) {
      setFormData({
        name: fullUserData.name || '',
        email: fullUserData.email || '',
        phone: fullUserData.phone || '',
        location: fullUserData.location || '',
        bio: fullUserData.bio || '',
      });
      setAvatar(fullUserData.avatar || '/avatars/default.png');
    }
  }, [fullUserData]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Preview imediato
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload real seria feito aqui
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await api.post('/users/avatar', formData);
      // setAvatar(response.data.avatarUrl);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload do avatar',
        type: 'error',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (user.id) {
        // Prepare data for update
        const updateData: any = {
          name: formData.name,
          email: formData.email, // Email change might require verification logic, careful
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        };

        const updatedUser = await updateUser(user.id, updateData);
        
        // Update local store
        setUser(updatedUser);
        
        setIsEditing(false);
        toast({
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso!',
          type: 'success',
        });
      }
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
  };

  const handleCancel = () => {
    if (!displayUser) return;

    // Restaurar dados originais
    setFormData({
      name: displayUser.name,
      email: displayUser.email,
      phone: displayUser.phone || '',
      location: displayUser.location || '',
      bio: displayUser.bio || '',
    });
    setAvatar(displayUser.avatar || '/avatars/default.png');
    setIsEditing(false);
  };

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Meu Perfil</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie suas informações pessoais
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
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
                  onClick={() => setIsEditing(true)}
                  className="gap-2 bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-400 dark:hover:bg-primary-500 dark:text-background font-semibold shadow focus:ring-2 focus:ring-primary-300 focus:outline-none transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da Esquerda - Informações Principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card de Perfil */}
              <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center justify-center gap-3 min-w-[8rem]">
                      <div className="relative flex items-center justify-center">
                        <img
                          src={avatar}
                          alt={formData.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-border dark:border-border-dark"
                        />
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
                          onChange={handleAvatarChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        {formData.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user?.id}</p>
                    </div>

                    {/* Formulário */}
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
                              onChange={handleChange}
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
                              onChange={handleChange}
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
                              onChange={handleChange}
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
                              onChange={handleChange}
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
                          onChange={handleChange}
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

            {/* Coluna da Direita - Ações Extras / Segurança */}
            <div className="space-y-6">
              {/* Card de Segurança */}
              <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary-400" />
                    <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                      Segurança
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Alterar Senha
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                      Encerrar Sessões
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
