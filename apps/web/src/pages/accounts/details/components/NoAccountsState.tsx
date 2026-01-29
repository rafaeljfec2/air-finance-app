import { Button } from '@/components/ui/button';
import { Landmark, Plus, Sparkles, ArrowUpDown, PieChart } from 'lucide-react';

interface NoAccountsStateProps {
  readonly onAddAccount: () => void;
}

export function NoAccountsState({ onAddAccount }: NoAccountsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center">
            <Landmark className="w-12 h-12 text-blue-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-3">
          Cadastre suas contas bancárias
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Adicione suas contas bancárias para acompanhar seu saldo, movimentações e ter uma visão
          completa das suas finanças.
        </p>

        <Button
          onClick={onAddAccount}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-base font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Cadastrar Primeira Conta
        </Button>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <ArrowUpDown className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Rastreie movimentações
            </span>
            <span className="text-xs text-muted-foreground mt-1">Entradas e saídas</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <Landmark className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Saldo em tempo real
            </span>
            <span className="text-xs text-muted-foreground mt-1">De todas as contas</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
              <PieChart className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Relatórios detalhados
            </span>
            <span className="text-xs text-muted-foreground mt-1">Por período</span>
          </div>
        </div>
      </div>
    </div>
  );
}
