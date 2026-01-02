import { Repeat, X } from 'lucide-react';

interface ModalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export function ModalHeader({ isEditing, onClose }: Readonly<ModalHeaderProps>) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-border-dark flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
          <Repeat className="h-5 w-5 text-primary-500 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text dark:text-text-dark">
            {isEditing ? 'Editar Transação Recorrente' : 'Nova Transação Recorrente'}
          </h2>
          <p className="text-sm text-muted-foreground dark:text-gray-400 dark:text-gray-400">
            {isEditing
              ? 'Atualize as informações da transação recorrente'
              : 'Preencha os dados da nova transação recorrente'}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
