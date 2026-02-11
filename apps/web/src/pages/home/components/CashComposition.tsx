import { formatCurrency } from '@/utils/formatters';
import type { CashComposition as CashCompositionData, CashInsight } from '../hooks/useHomePageData';

interface CashCompositionProps {
  readonly composition: CashCompositionData;
  readonly cashInsight: CashInsight;
  readonly isPrivacyModeEnabled: boolean;
}

interface CompositionLineItem {
  readonly label: string;
  readonly value: number;
  readonly type: 'revenue' | 'expense';
}

function buildLineItems(composition: CashCompositionData): readonly CompositionLineItem[] {
  return [
    { label: 'Receitas recorrentes', value: composition.recurringRevenue, type: 'revenue' },
    { label: 'Despesas fixas', value: composition.fixedExpenses, type: 'expense' },
    { label: 'Receitas pontuais', value: composition.oneTimeRevenue, type: 'revenue' },
    { label: 'Despesas vari\u00E1veis', value: composition.variableExpenses, type: 'expense' },
  ];
}

function hasNonZeroValue(composition: CashCompositionData): boolean {
  return (
    composition.recurringRevenue > 0 ||
    composition.oneTimeRevenue > 0 ||
    composition.fixedExpenses > 0 ||
    composition.variableExpenses > 0
  );
}

export function CashComposition({
  composition,
  cashInsight,
  isPrivacyModeEnabled,
}: Readonly<CashCompositionProps>) {
  if (isPrivacyModeEnabled || !hasNonZeroValue(composition)) {
    return null;
  }

  const items = buildLineItems(composition);

  return (
    <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 mt-3">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
        {'Composi\u00E7\u00E3o do caixa'}
      </p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
            <span
              className={`font-medium tabular-nums ${
                item.type === 'revenue'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {item.type === 'expense' ? '-' : ''}
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2.5">
        {cashInsight.label}
      </p>
    </div>
  );
}
