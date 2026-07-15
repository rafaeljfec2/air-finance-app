import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/spinner';
import { useYearlyCashFlow } from '@/hooks/useYearlyCashFlow';
import { cn } from '@/lib/utils';
import { useCompanyStore } from '@/stores/company';
import type { CashFlow } from '@/types/budget';
import { formatCurrency } from '@/utils/format';

interface CashFlowYearlyModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly year: string;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function getMonthLabel(monthKey: string): string {
  const monthNum = Number.parseInt(monthKey.split('-')[1], 10);
  return MONTH_NAMES[monthNum - 1] ?? monthKey;
}

interface YearlyRow {
  readonly month: string;
  readonly totalIncome: number;
  readonly totalExpense: number;
  readonly balance: number;
  readonly accumulated: number;
}

function buildYearlyRows(data: CashFlow[]): YearlyRow[] {
  return data.map((row) => ({
    month: row.month,
    totalIncome: row.totalIncome,
    totalExpense: row.totalExpense,
    balance: row.totalIncome - row.totalExpense,
    accumulated: row.finalBalance,
  }));
}

function computeTotals(rows: YearlyRow[]) {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const row of rows) {
    totalIncome += row.totalIncome;
    totalExpense += row.totalExpense;
  }

  const lastRow = rows.at(-1);
  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    finalAccumulated: lastRow?.accumulated ?? 0,
  };
}

function ValueCell({
  value,
  colorize = false,
}: {
  readonly value: number;
  readonly colorize?: boolean;
}) {
  const formatted = formatCurrency(Math.abs(value));
  if (!colorize) return <span>{formatted}</span>;

  return (
    <span
      className={cn(
        value > 0 && 'text-blue-600 dark:text-blue-400',
        value < 0 && 'text-red-600 dark:text-red-400',
        value === 0 && 'text-gray-500 dark:text-gray-400',
      )}
    >
      {value < 0 ? `- ${formatted}` : formatted}
    </span>
  );
}

function DesktopTable({ rows }: { readonly rows: YearlyRow[] }) {
  const totals = computeTotals(rows);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Mes
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Entradas
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Saidas
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Saldo
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Acumulado
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.month}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">
                {getMonthLabel(row.month)}
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                {formatCurrency(row.totalIncome)}
              </td>
              <td className="py-2.5 px-3 text-right text-red-600 dark:text-red-400">
                {formatCurrency(row.totalExpense)}
              </td>
              <td className="py-2.5 px-3 text-right">
                <ValueCell value={row.balance} colorize />
              </td>
              <td className="py-2.5 px-3 text-right font-medium">
                <ValueCell value={row.accumulated} colorize />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-semibold">
            <td className="py-3 px-3 text-gray-900 dark:text-white">Total</td>
            <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totals.totalIncome)}
            </td>
            <td className="py-3 px-3 text-right text-red-600 dark:text-red-400">
              {formatCurrency(totals.totalExpense)}
            </td>
            <td className="py-3 px-3 text-right">
              <ValueCell value={totals.netBalance} colorize />
            </td>
            <td className="py-3 px-3 text-right">
              <ValueCell value={totals.finalAccumulated} colorize />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function MobileCards({ rows }: { readonly rows: YearlyRow[] }) {
  const totals = computeTotals(rows);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.month} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {getMonthLabel(row.month)}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Entradas</span>
            <span className="text-right text-emerald-600 dark:text-emerald-400">
              {formatCurrency(row.totalIncome)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Saidas</span>
            <span className="text-right text-red-600 dark:text-red-400">
              {formatCurrency(row.totalExpense)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Saldo</span>
            <span className="text-right">
              <ValueCell value={row.balance} colorize />
            </span>
            <span className="text-gray-500 dark:text-gray-400">Acumulado</span>
            <span className="text-right font-medium">
              <ValueCell value={row.accumulated} colorize />
            </span>
          </div>
        </div>
      ))}

      <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 border-t-2 border-gray-300 dark:border-gray-600">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Total Anual</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-semibold">
          <span className="text-gray-500 dark:text-gray-400">Entradas</span>
          <span className="text-right text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totals.totalIncome)}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Saidas</span>
          <span className="text-right text-red-600 dark:text-red-400">
            {formatCurrency(totals.totalExpense)}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Saldo</span>
          <span className="text-right">
            <ValueCell value={totals.netBalance} colorize />
          </span>
          <span className="text-gray-500 dark:text-gray-400">Acumulado</span>
          <span className="text-right">
            <ValueCell value={totals.finalAccumulated} colorize />
          </span>
        </div>
      </div>
    </div>
  );
}

export function CashFlowYearlyModal({ open, onClose, year }: CashFlowYearlyModalProps) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? null;
  const { data, isLoading } = useYearlyCashFlow(companyId, year, { enabled: open });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Fluxo de Caixa ${year}`}
      className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
    >
      <div className="overflow-y-auto flex-1 -mx-4 sm:-mx-6 px-4 sm:px-6">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-emerald-500" />
          </div>
        )}

        {!isLoading &&
          data &&
          data.length > 0 &&
          (() => {
            const rows = buildYearlyRows(data);
            return (
              <>
                <div className="hidden sm:block">
                  <DesktopTable rows={rows} />
                </div>
                <div className="sm:hidden">
                  <MobileCards rows={rows} />
                </div>
              </>
            );
          })()}

        {!isLoading && (!data || data.length === 0) && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">
            Nenhum dado de fluxo de caixa encontrado para {year}.
          </p>
        )}
      </div>
    </Modal>
  );
}
