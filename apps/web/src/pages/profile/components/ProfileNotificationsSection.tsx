import { Bell, Mail, Megaphone, RefreshCw, ShieldAlert, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Switch } from '@/components/ui/switch';

import type { ProfileNotificationsFormValues } from '../schemas';

import { ProfileSectionCard } from './ProfileSectionCard';

interface ProfileNotificationsSectionProps {
  readonly notifications: ProfileNotificationsFormValues;
  readonly isSaving: boolean;
  readonly onToggle: (key: keyof ProfileNotificationsFormValues) => void;
}

interface NotificationItem {
  readonly key: keyof ProfileNotificationsFormValues;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly locked?: boolean;
}

const ESSENTIAL: NotificationItem[] = [
  {
    key: 'security',
    title: 'Alertas de segurança',
    description: 'Avisos de login, alteração de senha e atividades suspeitas',
    icon: ShieldAlert,
    locked: true,
  },
  {
    key: 'email',
    title: 'Email',
    description: 'Resumos e avisos importantes enviados para seu email',
    icon: Mail,
  },
];

const OPTIONAL: NotificationItem[] = [
  {
    key: 'push',
    title: 'Push no dispositivo',
    description: 'Notificações em tempo real no navegador ou app',
    icon: Smartphone,
  },
  {
    key: 'updates',
    title: 'Atualizações do produto',
    description: 'Novidades de recursos e melhorias da plataforma',
    icon: RefreshCw,
  },
  {
    key: 'marketing',
    title: 'Novidades e promoções',
    description: 'Ofertas, campanhas e conteúdos comerciais',
    icon: Megaphone,
  },
];

function NotificationGroup({
  title,
  items,
  notifications,
  isSaving,
  onToggle,
}: Readonly<{
  title: string;
  items: NotificationItem[];
  notifications: ProfileNotificationsFormValues;
  isSaving: boolean;
  onToggle: (key: keyof ProfileNotificationsFormValues) => void;
}>) {
  return (
    <div className="space-y-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="divide-y divide-border rounded-xl border border-border dark:divide-border-dark dark:border-border-dark">
        {items.map(({ key, title: itemTitle, description, icon: Icon, locked }) => {
          const checked = notifications[key];
          return (
            <div
              key={key}
              className="flex items-start justify-between gap-4 px-4 py-3.5 sm:items-center"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 dark:bg-muted/20">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text dark:text-text-dark">{itemTitle}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                  {locked ? (
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                      Recomendado manter ativo por segurança
                    </p>
                  ) : null}
                </div>
              </div>
              <Switch
                checked={checked}
                disabled={isSaving}
                onCheckedChange={() => onToggle(key)}
                aria-label={itemTitle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileNotificationsSection({
  notifications,
  isSaving,
  onToggle,
}: ProfileNotificationsSectionProps) {
  return (
    <ProfileSectionCard
      title="Notificações"
      description="Alterações são salvas automaticamente ao alternar cada opção"
      icon={<Bell className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />}
    >
      <div className="space-y-6">
        <NotificationGroup
          title="Essenciais"
          items={ESSENTIAL}
          notifications={notifications}
          isSaving={isSaving}
          onToggle={onToggle}
        />
        <NotificationGroup
          title="Opcionais"
          items={OPTIONAL}
          notifications={notifications}
          isSaving={isSaving}
          onToggle={onToggle}
        />
      </div>
    </ProfileSectionCard>
  );
}
