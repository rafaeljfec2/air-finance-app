import { CreditCard } from 'lucide-react';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

interface OfCreditCardVisualProps {
  readonly card: OpenFinanceCreditCard;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}

function statusLabel(status?: string): string {
  if (!status) return 'Conectado';
  if (status === 'CONNECTED' || status === 'SYNCED') return 'Conectado';
  if (status === 'SYNCING') return 'Sincronizando';
  if (status === 'ERROR') return 'Erro na conexão';
  return status;
}

export function OfCreditCardVisual({
  card,
  isSelected,
  onClick,
}: Readonly<OfCreditCardVisualProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative box-border h-[132px] w-[240px] min-w-[240px] flex-shrink-0 overflow-hidden rounded-xl border-2 text-left transition-all duration-200 ${
        isSelected ? 'border-white/40 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
      }`}
      style={{
        background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white shadow-sm">
            <CreditCard className="h-4 w-4" style={{ color: card.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-bold leading-tight text-white" title={card.name}>
              {card.name}
            </h3>
            <p className="mt-0.5 text-[10px] font-medium text-white/70">Cartão de Crédito</p>
          </div>
        </div>

        <div className="mt-2 space-y-0.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-white/70">
            Final do cartão
          </p>
          <p className="text-lg font-bold tracking-tight text-white">
            {card.digits ? `•••• ${card.digits}` : '••••'}
          </p>
        </div>

        <div className="mt-2">
          <div className="h-1 overflow-hidden rounded-full bg-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSelected ? 'w-full bg-white/70' : 'w-1/3 bg-white/40'
              }`}
            />
          </div>
          <p className="mt-1 text-[9px] text-white/60">Open Finance · {statusLabel(card.status)}</p>
        </div>
      </div>
    </button>
  );
}
