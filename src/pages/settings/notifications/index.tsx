import { ViewDefault } from '@/layouts/ViewDefault';
import { BellIcon } from '@heroicons/react/24/outline';

export function NotificationsPage() {
  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 pt-0 pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-4 flex items-center gap-2">
          <BellIcon className="h-6 w-6 text-primary-500" /> Notificações
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Gerencie suas preferências de notificações e alertas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Conteúdo específico de Notificações será adicionado aqui */}
        </div>
      </div>
    </ViewDefault>
  );
}
