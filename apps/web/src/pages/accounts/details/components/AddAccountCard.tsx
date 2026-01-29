import { Plus } from 'lucide-react';

interface AddAccountCardProps {
  readonly onClick: () => void;
}

export function AddAccountCard({ onClick }: Readonly<AddAccountCardProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[280px] min-w-[280px] h-[156px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border dark:border-border-dark bg-card/50 dark:bg-card-dark/50 transition-all duration-200 hover:opacity-100 hover:border-primary dark:hover:border-primary-dark hover:bg-card dark:hover:bg-card-dark focus:outline-none opacity-80"
      aria-label="Adicionar nova conta"
    >
      <div className="w-12 h-12 rounded-full bg-background dark:bg-background-dark flex items-center justify-center mb-2 border border-border dark:border-border-dark">
        <Plus className="h-6 w-6 text-text-muted dark:text-text-muted-dark" />
      </div>
      <span className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
        Adicionar nova conta bancária
      </span>
    </button>
  );
}
