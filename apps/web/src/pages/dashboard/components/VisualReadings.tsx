import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { BalanceHistoryPoint, DashboardSummary } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

import { ChartAxisTick, DocCard, Stat, Text } from '../laudo-layout/primitives';
import { useLaudoChartTheme } from '../laudo-layout/useLaudoChartTheme';
import { aggregateWeeklyRevenueExpense } from '../utils/aggregateWeeklyRevenueExpense';

import { ExpenseCalendarCard } from './ExpenseCalendarCard';

interface FolgaPoint {
  readonly label: string;
  readonly folga: number;
}

function buildDailyFolga(points: readonly BalanceHistoryPoint[]): FolgaPoint[] {
  return points
    .filter((point) => point.income !== 0 || point.expenses !== 0)
    .map((point) => {
      const date = new Date(point.date);
      return {
        label: `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`,
        folga: Math.round(point.income - point.expenses),
      };
    });
}

function formatTooltipCurrency(value: number, name: string): [string, string] {
  return [formatCurrency(value), name];
}

export function VisualReadings({
  periodLabel,
  summary,
  balanceHistory,
  liquidityAvailable,
  creditPct,
  companyId,
  initialCalendarReferenceDate,
}: Readonly<{
  periodLabel: string;
  summary: DashboardSummary | null | undefined;
  balanceHistory: readonly BalanceHistoryPoint[];
  liquidityAvailable: number | undefined;
  creditPct: number | undefined;
  companyId: string;
  initialCalendarReferenceDate?: string;
}>) {
  const chartTheme = useLaudoChartTheme();

  const weeklyData = useMemo(() => aggregateWeeklyRevenueExpense(balanceHistory), [balanceHistory]);
  const folgaData = useMemo(() => buildDailyFolga(balanceHistory), [balanceHistory]);

  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;
  const balance = summary?.balance ?? 0;

  const tooltipProps = {
    contentStyle: chartTheme.tooltip,
    labelStyle: chartTheme.tooltipLabel,
    itemStyle: chartTheme.tooltipItem,
    formatter: formatTooltipCurrency,
  } as const;

  return (
    <section aria-label="Leituras visuais" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Leituras visuais
        </h2>
        <Text size="small" tone="secondary">
          Evidências do período {periodLabel}. Ajudam a comprovar a interpretação dos pilares — não
          são a decisão do dia.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Receita do período" value={formatCurrency(income)} />
        <Stat label="Despesa do período" value={formatCurrency(expenses)} tone="warning" />
        <Stat
          label="Resultado do período"
          value={formatCurrency(balance)}
          tone={balance >= 0 ? 'success' : 'danger'}
        />
        <Stat
          label={
            liquidityAvailable !== undefined
              ? 'Caixa disponível agora'
              : 'Utilização do cartão agora'
          }
          value={
            liquidityAvailable !== undefined
              ? formatCurrency(liquidityAvailable)
              : creditPct !== undefined
                ? `${creditPct.toFixed(1)}%`
                : '—'
          }
        />
      </div>
      <Text size="small" tone="secondary">
        Resultado do período = receita − despesa em {periodLabel}. Caixa e cartão refletem a posição
        observada agora, não o mesmo recorte do resultado.
      </Text>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DocCard header="Receita × despesa (R$)" footer={`Totais por semana de ${periodLabel}.`}>
          {' '}
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                barCategoryGap="28%"
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={(props) => <ChartAxisTick {...props} fill={chartTheme.tick.fill} dy={10} />}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={(props) => (
                    <ChartAxisTick
                      {...props}
                      fill={chartTheme.tick.fill}
                      textAnchor="end"
                      dx={-4}
                    />
                  )}
                  width={56}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...tooltipProps} cursor={chartTheme.cursor} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="income"
                  name="Receita"
                  fill={chartTheme.income}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                  animationDuration={700}
                />
                <Bar
                  dataKey="expenses"
                  name="Despesa"
                  fill={chartTheme.expense}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                  animationDuration={700}
                  animationBegin={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DocCard>

        <DocCard
          header="Folga do período (R$)"
          footer={`Folga diária = receita − despesa em ${periodLabel}.`}
        >
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={folgaData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="folgaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartTheme.folgaPos} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chartTheme.folgaPos} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={(props) => <ChartAxisTick {...props} fill={chartTheme.tick.fill} dy={10} />}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={(props) => (
                    <ChartAxisTick
                      {...props}
                      fill={chartTheme.tick.fill}
                      textAnchor="end"
                      dx={-4}
                    />
                  )}
                  width={56}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...tooltipProps} />
                <Area
                  type="monotone"
                  dataKey="folga"
                  name="Folga"
                  stroke={chartTheme.folgaPos}
                  strokeWidth={2}
                  fill="url(#folgaFill)"
                  animationDuration={700}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DocCard>

        <ExpenseCalendarCard
          companyId={companyId}
          initialReferenceDate={initialCalendarReferenceDate}
        />
      </div>
    </section>
  );
}
