import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

interface NotificationsData {
  email: boolean;
  push: boolean;
  updates: boolean;
  marketing: boolean;
  security: boolean;
}

interface ProfileNotificationsSectionProps {
  readonly notifications: NotificationsData;
  readonly isSaving: boolean;
  readonly onToggle: (key: keyof NotificationsData) => void;
  readonly onSave: () => void;
}

const NOTIFICATION_LABELS: Record<keyof NotificationsData, string> = {
  email: 'Notificações por Email',
  push: 'Notificações Push',
  updates: 'Atualizações do Sistema',
  marketing: 'Novidades e Promoções',
  security: 'Alertas de Segurança',
};

export function ProfileNotificationsSection({
  notifications,
  isSaving,
  onToggle,
  onSave,
}: ProfileNotificationsSectionProps) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
      <div className="space-y-6">
        {(Object.entries(notifications) as [keyof NotificationsData, boolean][]).map(
          ([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-border dark:border-border-dark pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-text dark:text-text-dark">
                  {NOTIFICATION_LABELS[key]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {value ? 'Ativado' : 'Desativado'}
                </p>
              </div>
              <Switch checked={value} onCheckedChange={() => onToggle(key)} />
            </div>
          ),
        )}

        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} disabled={isSaving} variant="success" className="gap-2">
            {isSaving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        </div>
      </div>
    </Card>
  );
}
