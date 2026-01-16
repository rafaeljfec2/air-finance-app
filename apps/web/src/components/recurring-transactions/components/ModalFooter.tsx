import { Button } from '@/components/ui/button';

interface ModalFooterProps {
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function ModalFooter({ isLoading, isEditing, onCancel }: Readonly<ModalFooterProps>) {
  const submitButtonText = isLoading
    ? 'Salvando...'
    : isEditing
      ? 'Salvar Alterações'
      : 'Criar Transação Recorrente';

  return (
    <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        form="recurring-transaction-form"
        className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
        disabled={isLoading}
      >
        {submitButtonText}
      </Button>
    </div>
  );
}
