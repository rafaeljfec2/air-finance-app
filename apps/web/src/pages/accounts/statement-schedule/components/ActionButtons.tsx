import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface ActionButtonsProps {
  isSyncing: boolean;
  isSaving: boolean;
  isLoading: boolean;
  onSyncNow: () => void;
  onSave: () => void;
}

export function ActionButtons({
  isSyncing,
  isSaving,
  isLoading,
  onSyncNow,
  onSave,
}: Readonly<ActionButtonsProps>) {
  return (
    <div className="flex gap-3 pt-4 border-t border-border dark:border-border-dark">
      <Button
        type="button"
        onClick={onSyncNow}
        disabled={isSyncing || isLoading}
        variant="outline"
        className="flex-1 flex items-center justify-center gap-2 h-10 text-sm"
      >
        <Play className="h-4 w-4" />
        <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
      </Button>
      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving || isLoading}
        className="flex-1 h-10 bg-primary-500 hover:bg-primary-600 text-white text-sm"
      >
        {isSaving ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  );
}
