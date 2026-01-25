import { formatCurrency, calculateUsagePercentage } from '../utils';

interface ConsolidatedHeaderProps {
  readonly limitTotal: number;
  readonly limitUsed: number;
  readonly limitAvailable: number;
  readonly cardColor?: string;
}

const DEFAULT_CARD_COLOR = '#2D6B4E';

const getUsageColorClass = (percentage: number): string => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 50) return 'bg-amber-500';
  return 'bg-primary-500';
};

export function ConsolidatedHeader({
  limitTotal,
  limitUsed,
  limitAvailable,
  cardColor = DEFAULT_CARD_COLOR,
}: ConsolidatedHeaderProps) {
  const usagePercentage = calculateUsagePercentage(limitUsed, limitTotal);
  const usageColorClass = getUsageColorClass(usagePercentage);
  const progressWidth = Math.min(usagePercentage, 100);

  return (
    <div
      className="rounded-xl p-6 text-white"
      style={{
        background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-2">
          <p className="text-white/70 text-sm mb-1">Limite Utilizado</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCurrency(limitUsed)}</span>
            <span className="text-white/60 text-sm">de {formatCurrency(limitTotal)}</span>
          </div>
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${usageColorClass}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-1.5">{usagePercentage.toFixed(1)}% utilizado</p>
        </div>

        <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Disponível</p>
          <p className="text-xl font-semibold">{formatCurrency(limitAvailable)}</p>
        </div>

        <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Limite Total</p>
          <p className="text-xl font-semibold">{formatCurrency(limitTotal)}</p>
        </div>
      </div>
    </div>
  );
}
