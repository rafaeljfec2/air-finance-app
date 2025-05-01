import { useState } from 'react'
import { ViewDefault } from '@/layouts/ViewDefault'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/stores/useTheme'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Camera,
  Palette,
  Moon,
  Sun,
  Globe,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Profile() {
  const { user } = useAuthStore()
  const { isDarkMode, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatar, setAvatar] = useState('/avatars/default.png')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      updates: false
    },
    preferences: {
      currency: 'BRL',
      language: 'pt-BR'
    }
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNotificationChange = (key: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
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
                          alt={`Foto de perfil de ${formData.name}`}
                          aria-label="Foto de perfil"
                          className="w-32 h-32 rounded-full object-cover border-4 border-border dark:border-border-dark"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
                        >
                          <Camera className="h-4 w-4 text-white" />
                        </label>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
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
                          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                            Nome
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
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
                          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
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
                          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                            Telefone
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
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
                          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                            Localização
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                              placeholder="Cidade, Estado"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                          Biografia
                        </label>
                        <Textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                          placeholder="Conte um pouco sobre você..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="mt-6 flex justify-end gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className={cn(
                            "bg-primary-500 hover:bg-primary-600 text-white",
                            isSaving && "opacity-70 cursor-not-allowed"
                          )}
                        >
                          {isSaving ? 'Salvando...' : 'Salvar'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white"
                      >
                        Editar Perfil
                      </Button>
                    )}
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
                      className="w-full justify-start border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                    >
                      Alterar Senha
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                    >
                      Autenticação em Duas Etapas
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                    >
                      Dispositivos Conectados
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Coluna da Direita - Preferências */}
            <div className="space-y-6">
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
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Notificações por Email
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Receba atualizações importantes por email
                        </p>
                      </div>
                      <Switch
                        checked={formData.notifications.email}
                        onCheckedChange={() =>
                          handleNotificationChange('email')
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Notificações Push
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Receba alertas em tempo real
                        </p>
                      </div>
                      <Switch
                        checked={formData.notifications.push}
                        onCheckedChange={() =>
                          handleNotificationChange('push')
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          Atualizações do Sistema
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Novidades e melhorias
                        </p>
                      </div>
                      <Switch
                        checked={formData.notifications.updates}
                        onCheckedChange={() =>
                          handleNotificationChange('updates')
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>

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
                      <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                        Tema
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className={cn(
                            "border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark",
                            isDarkMode
                              ? "bg-card dark:bg-card-dark text-primary-400"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                          onClick={() => setTheme(true)}
                        >
                          <Moon className="h-4 w-4 mr-2" />
                          Escuro
                        </Button>
                        <Button
                          variant="outline"
                          className={cn(
                            "border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark",
                            !isDarkMode
                              ? "bg-card dark:bg-card-dark text-primary-400"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                          onClick={() => setTheme(false)}
                        >
                          <Sun className="h-4 w-4 mr-2" />
                          Claro
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                        Idioma
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <select
                          value={formData.preferences.language}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                language: e.target.value
                              }
                            }))
                          }
                          className="w-full pl-10 pr-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg text-text dark:text-text-dark focus:border-primary-500"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                        Moeda
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <select
                          value={formData.preferences.currency}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                currency: e.target.value
                              }
                            }))
                          }
                          className="w-full pl-10 pr-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg text-text dark:text-text-dark focus:border-primary-500"
                        >
                          <option value="BRL">Real (R$)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ViewDefault>
  )
} 