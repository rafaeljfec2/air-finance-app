import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Sparkles, TrendingUp, Shield } from 'lucide-react';

interface NoCreditCardsStateProps {
  readonly onAddCard: () => void;
}

export function NoCreditCardsState({ onAddCard }: NoCreditCardsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center">
            <CreditCard className="w-12 h-12 text-primary-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-3">
          Comece a controlar seus cartões
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Cadastre seus cartões de crédito e tenha controle total sobre suas faturas, limites e
          gastos em um só lugar.
        </p>

        <Button
          onClick={onAddCard}
          size="lg"
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-base font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Cadastrar Primeiro Cartão
        </Button>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Acompanhe gastos
            </span>
            <span className="text-xs text-muted-foreground mt-1">Em tempo real</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Controle limites
            </span>
            <span className="text-xs text-muted-foreground mt-1">De todos os cartões</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Evite surpresas
            </span>
            <span className="text-xs text-muted-foreground mt-1">Nas faturas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
