import { CreditCard, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyOpenFinanceCards() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/15">
        <CreditCard className="h-10 w-10 text-primary-500" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-text dark:text-text-dark">
        Nenhum cartão Open Finance
      </h2>
      <p className="mb-8 max-w-md text-sm text-text-muted dark:text-text-muted-dark">
        Conecte uma instituição via Open Finance e importe seus cartões para ver o extrato de
        lançamentos aqui.
      </p>
      <Link
        to="/openfinance"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary-500 px-8 py-3 text-base font-medium text-white hover:bg-primary-600"
      >
        <Link2 className="mr-2 h-5 w-5" />
        Ir para Open Finance
      </Link>
    </div>
  );
}
