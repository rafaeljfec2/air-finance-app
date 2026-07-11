import { Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ConnectOpenFinanceCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/openfinance')}
      className="box-border flex h-[132px] w-[240px] min-w-[240px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 opacity-80 transition-all duration-200 hover:border-primary hover:bg-card hover:opacity-100 focus:outline-none dark:border-border-dark dark:bg-card-dark/50 dark:hover:border-primary-dark dark:hover:bg-card-dark"
      aria-label="Conectar Open Finance"
    >
      <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background dark:border-border-dark dark:bg-background-dark">
        <Link2 className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
      </div>
      <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
        Conectar Open Finance
      </span>
    </button>
  );
}
