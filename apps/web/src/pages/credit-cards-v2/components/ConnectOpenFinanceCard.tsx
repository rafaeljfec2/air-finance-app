import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ConnectOpenFinanceCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/openfinance')}
      className="box-border flex h-[150px] w-[220px] min-w-[220px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 opacity-80 transition-all duration-200 hover:border-primary hover:bg-card hover:opacity-100 focus:outline-none dark:border-border-dark dark:bg-card-dark/50 dark:hover:border-primary-dark dark:hover:bg-card-dark"
      aria-label="Adicionar cartão via Open Finance"
    >
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background dark:border-border-dark dark:bg-background-dark">
        <Plus className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
      </div>
      <span className="text-xs font-semibold text-text dark:text-text-dark">Adicionar cartão</span>
      <span className="mt-0.5 text-[10px] text-text-muted dark:text-text-muted-dark">
        Via Open Finance
      </span>
    </button>
  );
}
