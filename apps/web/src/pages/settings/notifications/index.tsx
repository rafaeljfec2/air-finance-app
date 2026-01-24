import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getCurrentUser } from '@/services/authService';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';
import { Bell, ChevronLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    marketing: false,
    security: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const fullUser = await getCurrentUser();
        if (fullUser.notifications) {
          setNotifications({
            email: fullUser.notifications.email ?? true,
            push: fullUser.notifications.push ?? true,
            updates: fullUser.notifications.updates ?? false,
            marketing: fullUser.notifications.marketing ?? false,
            security: fullUser.notifications.security ?? true,
          });
        }
      } catch (error) {
        console.error('Error fetching user notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user?.id]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const updateData = {
        notifications: { ...notifications },
      };

      const updatedUser = await updateUser(user.id, updateData);
      setUser(mapUserServiceToUserType(updatedUser));
      toast({
        title: 'Sucesso',
        description: 'Notificações atualizadas com sucesso!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar notificações',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const labels: Record<string, string> = {
    email: 'Notificações por Email',
    push: 'Notificações Push',
    updates: 'Atualizações do Sistema',
    marketing: 'Novidades e Promoções',
    security: 'Alertas de Segurança',
  };

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary-500" />
            Notificações
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="text-primary-500" />
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border-b border-border dark:border-border-dark pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-text dark:text-text-dark">
                        {labels[key] || key}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {value ? 'Ativado' : 'Desativado'}
                      </p>
                    </div>
                    <Switch
                      checked={Boolean(value)}
                      onCheckedChange={() => toggleNotification(key as keyof typeof notifications)}
                    />
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="success"
                    className="gap-2"
                  >
                    {isSaving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
