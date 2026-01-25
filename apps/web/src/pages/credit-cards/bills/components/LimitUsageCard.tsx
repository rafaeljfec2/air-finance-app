import { CalendarDays, ShoppingBag, CreditCard } from 'lucide-react';

interface LimitUsageCardProps {
  readonly limitTotal: number;
  readonly limitUsed: number;
  readonly limitAvailable: number;
  readonly dueDay: number;
  readonly bestPurchaseDay: number;
  readonly billStatus?: 'OPEN' | 'CLOSED' | 'PAID';
  readonly onPayBill?: () => void;
}

export function LimitUsageCard({
  limitTotal,
  limitUsed,
  limitAvailable,
  dueDay,
  bestPurchaseDay,
  billStatus = 'OPEN',
  onPayBill,
}: LimitUsageCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const usagePercentage = limitTotal > 0 ? (limitUsed / limitTotal) * 100 : 0;

  const getStatusConfig = () => {
    switch (billStatus) {
      case 'PAID':
        return { label: 'Fatura Paga', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' };
      case 'CLOSED':
        return { label: 'Fatura Fechada', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' };
      default:
        return { label: 'Fatura Aberta', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div className="p-5 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark">Resumo do Cartão</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-text-muted dark:text-text-muted-dark">Uso do limite</span>
              <span className="font-medium text-text dark:text-text-dark">{usagePercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-background dark:bg-background-dark rounded-lg p-3">
              <p className="text-[10px] text-text-muted dark:text-text-muted-dark uppercase tracking-wide">Disponível</p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatCurrency(limitAvailable)}</p>
            </div>
            <div className="bg-background dark:bg-background-dark rounded-lg p-3">
              <p className="text-[10px] text-text-muted dark:text-text-muted-dark uppercase tracking-wide">Limite</p>
              <p className="text-lg font-bold text-text dark:text-text-dark">{formatCurrency(limitTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-muted dark:text-text-muted-dark">Vencimento</p>
            <p className="text-sm font-semibold text-text dark:text-text-dark">Dia {dueDay}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-muted dark:text-text-muted-dark">Melhor dia para compras</p>
            <p className="text-sm font-semibold text-text dark:text-text-dark">Dia {bestPurchaseDay}</p>
          </div>
        </div>
      </div>

      {billStatus !== 'PAID' && (
        <div className="p-5 pt-0">
          <button
            onClick={onPayBill}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            Registrar Pagamento
          </button>
        </div>
      )}
    </div>
  );
}
