import { Button } from '@/components/ui/button';
import { Mail, Plus, Trash2, Users as UsersIcon } from 'lucide-react';

interface UsersHeaderProps {
  onCreateClick: () => void;
  onDeleteAllDataClick: () => void;
  onSendRemindersClick: () => void;
  canDeleteAllData: boolean;
  canSendReminders: boolean;
}

export function UsersHeader({
  onCreateClick,
  onDeleteAllDataClick,
  onSendRemindersClick,
  canDeleteAllData,
  canSendReminders,
}: Readonly<UsersHeaderProps>) {
  return (
    <>
      {/* Mobile Header */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
            <UsersIcon className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text dark:text-text-dark">Usuários</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gerencie usuários do sistema</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onCreateClick}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 h-11 rounded-xl font-medium shadow-lg shadow-primary-500/20"
          >
            <Plus className="h-5 w-5" />
            Novo Usuário
          </Button>
          {canSendReminders && (
            <Button
              variant="outline"
              onClick={onSendRemindersClick}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl font-medium text-sm"
            >
              <Mail className="h-4 w-4" />
              Enviar lembretes
            </Button>
          )}
          {canDeleteAllData && (
            <Button
              variant="destructive"
              onClick={onDeleteAllDataClick}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl font-medium text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Deletar Todos os Dados
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-6 pb-6 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 dark:from-primary-400/20 dark:to-primary-500/10">
            <UsersIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text dark:text-text-dark mb-1">Usuários</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie usuários, permissões e acesso ao sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canSendReminders && (
            <Button
              variant="outline"
              onClick={onSendRemindersClick}
              className="flex items-center gap-2 h-12 px-6 rounded-xl font-semibold"
            >
              <Mail className="h-5 w-5" />
              Enviar lembretes
            </Button>
          )}
          {canDeleteAllData && (
            <Button
              variant="destructive"
              onClick={onDeleteAllDataClick}
              className="flex items-center gap-2 h-12 px-6 rounded-xl font-semibold"
            >
              <Trash2 className="h-5 w-5" />
              Deletar Todos os Dados
            </Button>
          )}
          <Button
            onClick={onCreateClick}
            className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2 h-12 px-6 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40"
          >
            <Plus className="h-5 w-5" />
            Novo Usuário
          </Button>
        </div>
      </div>
    </>
  );
}
