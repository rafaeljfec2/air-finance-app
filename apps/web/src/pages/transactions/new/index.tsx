import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { ViewDefault } from '@/layouts/ViewDefault';

import { NewTransactionForm } from './components/NewTransactionForm';

export function NewTransaction() {
  const navigate = useNavigate();

  return (
    <ViewDefault>
      <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark p-3 md:p-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center mb-3">
            <button
              onClick={() => navigate('/transactions')}
              className="mr-3 p-1.5 hover:bg-card dark:hover:bg-card-dark rounded-full transition-colors border border-transparent hover:border-border dark:hover:border-border-dark"
              aria-label="Voltar para transações"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Nova Transação</h1>
            </div>
          </div>

          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark shadow-sm rounded-xl overflow-hidden">
            <NewTransactionForm onCancel={() => navigate('/transactions')} />
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
