import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getCurrentUser } from '@/services/authService';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/stores/useTheme';
import {
    Bell,
    Bot,
    Camera,
    DollarSign,
    Edit2,
    Eye,
    EyeOff,
    Globe,
    Mail,
    MapPin,
    Moon,
    Palette,
    Phone,
    Save,
    Shield,
    Sun,
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
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
    marketing: boolean;
    security: boolean;
  };
  preferences: {
    currency: 'BRL' | 'USD' | 'EUR';
    language: 'pt-BR' | 'en-US' | 'es-ES';
    theme: 'light' | 'dark' | 'system';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  };
  integrations: {
    openaiApiKey: string;
    openaiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-5.2' | 'gpt-5-mini';
  };
};

export function Profile() {
  const { user, setUser } = useAuthStore();
  const { setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, setIsLoadingUser] = useState(false);
  const [fullUserData, setFullUserData] = useState<typeof user | null>(null);
  const [avatar, setAvatar] = useState(user?.avatar || '/avatars/default.png');
  const [showApiKey, setShowApiKey] = useState(false);

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
    notifications: {
      email: displayUser?.notifications?.email ?? true,
      push: displayUser?.notifications?.push ?? true,
      updates: displayUser?.notifications?.updates ?? false,
      marketing: displayUser?.notifications?.marketing ?? false,
      security: displayUser?.notifications?.security ?? true,
    },
    preferences: {
      currency: displayUser?.preferences?.currency || 'BRL',
      language: displayUser?.preferences?.language || 'pt-BR',
      theme: displayUser?.preferences?.theme || 'system',
      dateFormat: displayUser?.preferences?.dateFormat || 'DD/MM/YYYY',
    },
    integrations: {
      openaiApiKey: (displayUser as any)?.integrations?.openaiApiKey || '',
      openaiModel: (displayUser as any)?.integrations?.openaiModel || 'gpt-3.5-turbo',
    },
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
        notifications: {
          email: fullUserData.notifications?.email ?? true,
          push: fullUserData.notifications?.push ?? true,
          updates: fullUserData.notifications?.updates ?? false,
          marketing: fullUserData.notifications?.marketing ?? false,
          security: fullUserData.notifications?.security ?? true,
        },
        preferences: {
          currency: fullUserData.preferences?.currency || 'BRL',
          language: fullUserData.preferences?.language || 'pt-BR',
          theme: fullUserData.preferences?.theme || 'system',
          dateFormat: fullUserData.preferences?.dateFormat || 'DD/MM/YYYY',
        },
        integrations: {
          openaiApiKey: (fullUserData as any)?.integrations?.openaiApiKey || '',
          openaiModel: (fullUserData as any)?.integrations?.openaiModel || 'gpt-3.5-turbo',
        },
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

    if (name === 'openaiApiKey') {
      setFormData((prev) => ({
        ...prev,
        integrations: {
          ...prev.integrations,
          openaiApiKey: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (key: keyof ProfileFormData['notifications']) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handlePreferenceChange = <K extends keyof ProfileFormData['preferences']>(
    key: K,
    value: ProfileFormData['preferences'][K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));

    // Atualiza o tema imediatamente se for alterado
    if (key === 'theme') {
      setTheme(value === 'dark');
    }
  };

  const handleIntegrationChange = <K extends keyof ProfileFormData['integrations']>(
    key: K,
    value: ProfileFormData['integrations'][K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [key]: value,
      },
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
          notifications: formData.notifications,
          preferences: formData.preferences,
          integrations: formData.integrations,
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
      notifications: {
        email: displayUser.notifications?.email ?? true,
        push: displayUser.notifications?.push ?? true,
        updates: displayUser.notifications?.updates ?? false,
        marketing: displayUser.notifications?.marketing ?? false,
        security: displayUser.notifications?.security ?? true,
      },
      preferences: {
        currency: displayUser.preferences?.currency || 'BRL',
        language: displayUser.preferences?.language || 'pt-BR',
        theme: displayUser.preferences?.theme || 'system',
        dateFormat: displayUser.preferences?.dateFormat || 'DD/MM/YYYY',
      },
      integrations: {
        openaiApiKey: (displayUser as any)?.integrations?.openaiApiKey || '',
        openaiModel: (displayUser as any)?.integrations?.openaiModel || 'gpt-3.5-turbo',
      },
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
                Gerencie suas informações pessoais e preferências
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

              {/* Card de Integrações com IA */}
              <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="h-5 w-5 text-primary-400" />
                    <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                      Tecnologia e IA
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Configure suas chaves de API para permitir que a Inteligência Artificial
                    analise e categorize suas finanças automaticamente.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="openaiApiKey"
                        className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                      >
                        OpenAI API Key
                      </label>
                      <div className="relative">
                        <Input
                          id="openaiApiKey"
                          type={showApiKey ? 'text' : 'password'}
                          name="openaiApiKey"
                          value={formData.integrations.openaiApiKey}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="sk-..."
                          className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          disabled={!isEditing}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sua chave será armazenada de forma segura e usada apenas para
                        funcionalidades de IA.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="openaiModel"
                        className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                      >
                        Modelo Padrão
                      </label>
                      <Select
                        value={formData.integrations.openaiModel}
                        onValueChange={(value) =>
                          handleIntegrationChange(
                            'openaiModel',
                            value as 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-5.2' | 'gpt-5-mini',
                          )
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                          {formData.integrations.openaiModel}
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido e Econômico)</SelectItem>
                          <SelectItem value="gpt-4">GPT-4 (Maior Precisão)</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Atualizado)</SelectItem>
                          <SelectItem value="gpt-5.2">GPT-5.2 (Experimenta/Novo)</SelectItem>
                          <SelectItem value="gpt-5-mini">GPT-5 Mini (Leve)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card de Notificações */}
              <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-primary-400" />
                    <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                      Notificações
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(formData.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text dark:text-text-dark">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {key === 'email'
                              ? 'Receber notificações por email'
                              : key === 'push'
                                ? 'Receber notificações push'
                                : key === 'updates'
                                  ? 'Receber atualizações do sistema'
                                  : key === 'marketing'
                                    ? 'Receber novidades e promoções'
                                    : 'Receber alertas de segurança'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={() =>
                            handleNotificationChange(key as keyof ProfileFormData['notifications'])
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Coluna da Direita - Preferências */}
            <div className="space-y-6">
              {/* Card de Preferências */}
              <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-5 w-5 text-primary-400" />
                    <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                      Preferências
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="currency"
                        className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                      >
                        Moeda
                      </label>
                      <Select
                        value={formData.preferences.currency}
                        onValueChange={(value) =>
                          handlePreferenceChange('currency', value as 'BRL' | 'USD' | 'EUR')
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {formData.preferences.currency}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                          <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                          <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                      >
                        Idioma
                      </label>
                      <Select
                        value={formData.preferences.language}
                        onValueChange={(value) =>
                          handlePreferenceChange('language', value as 'pt-BR' | 'en-US' | 'es-ES')
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {formData.preferences.language === 'pt-BR'
                              ? 'Português'
                              : formData.preferences.language === 'en-US'
                                ? 'English'
                                : 'Español'}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                          <SelectItem value="pt-BR">Português</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="theme"
                        className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                      >
                        Tema
                      </label>
                      <Select
                        value={formData.preferences.theme}
                        onValueChange={(value) =>
                          handlePreferenceChange('theme', value as 'light' | 'dark' | 'system')
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                          <div className="flex items-center gap-2">
                            {formData.preferences.theme === 'light' ? (
                              <Sun className="h-4 w-4" />
                            ) : formData.preferences.theme === 'dark' ? (
                              <Moon className="h-4 w-4" />
                            ) : (
                              <Palette className="h-4 w-4" />
                            )}
                            {formData.preferences.theme === 'light'
                              ? 'Claro'
                              : formData.preferences.theme === 'dark'
                                ? 'Escuro'
                                : 'Sistema'}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="dateFormat"
                        className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                      >
                        Formato de Data
                      </label>
                      <Select
                        value={formData.preferences.dateFormat}
                        onValueChange={(value) =>
                          handlePreferenceChange(
                            'dateFormat',
                            value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD',
                          )
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                          {formData.preferences.dateFormat}
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

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
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        /* Implementar mudança de senha */
                      }}
                    >
                      <Shield className="h-4 w-4" />
                      Alterar Senha
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        /* Implementar autenticação de dois fatores */
                      }}
                    >
                      <Shield className="h-4 w-4" />
                      Autenticação de Dois Fatores
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
