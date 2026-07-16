import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DashboardSummary, ExpenseByCategory } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

import { ChartAxisTick, DocCard, Stack, Stat, Text } from '../laudo-layout/primitives';
import { useLaudoChartTheme } from '../laudo-layout/useLaudoChartTheme';

type FlowPoint = { readonly label: string; readonly income: number; readonly expenses: number };

function buildActivityFolga(points: readonly FlowPoint[]): Array<{ label: string; folga: number }> {
  const withActivity = points
    .map((row) => ({ label: row.label, folga: row.income - row.expenses }))
    .filter((row) => row.folga !== 0);
  if (withActivity.length > 0) {
    return withActivity;
  }
  return points.map((row) => ({ label: row.label, folga: row.income - row.expenses }));
}

function formatTooltipCurrency(value: number): [string, string] {
  return [formatCurrency(value), 'Valor'];
}

export function VisualReadings({
  periodLabel,
  summary,
  flowChartData,
  expensesByCategory,
  liquidityAvailable,
  creditPct,
}: Readonly<{
  periodLabel: string;
  summary: DashboardSummary | null | undefined;
  flowChartData: readonly FlowPoint[];
  expensesByCategory: readonly ExpenseByCategory[];
  liquidityAvailable: number | undefined;
  creditPct: number | undefined;
}>) {
  const chartTheme = useLaudoChartTheme();

  const periodCompareData = useMemo(() => {
    if (!summary) {
      return [];
    }
    return [
      { label: 'Receita', value: Math.round(summary.income), fill: chartTheme.income },
      { label: 'Despesa', value: Math.round(summary.expenses), fill: chartTheme.expense },
    ];
  }, [summary, chartTheme.income, chartTheme.expense]);

  const folgaChartData = useMemo(() => buildActivityFolga(flowChartData), [flowChartData]);

  const categoryPie = useMemo(() => {
    return expensesByCategory.slice(0, 8).map((row, index) => ({
      name: row.name,
      value: Math.round(row.value),
      color: row.color?.startsWith('#')
        ? row.color
        : chartTheme.categoryColors[index % chartTheme.categoryColors.length],
    }));
  }, [expensesByCategory, chartTheme.categoryColors]);

  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;
  const balance = summary?.balance ?? 0;

  const tooltipProps = {
    contentStyle: chartTheme.tooltip,
    labelStyle: chartTheme.tooltipLabel,
    itemStyle: chartTheme.tooltipItem,
    cursor: chartTheme.cursor,
    formatter: formatTooltipCurrency,
  } as const;

  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight text-text dark:border-border-dark dark:text-text-dark sm:text-xl">
          Leituras visuais
        </h2>
        <Text size="small" tone="secondary">
          Comprovam a interpretação acima · período {periodLabel}.
        </Text>
      </Stack>

      <Stack gap={12}>
        <Stat label="Receita do período" value={formatCurrency(income)} />
        <Stat label="Despesa do período" value={formatCurrency(expenses)} tone="warning" />
        <Stat
          label="Resultado"
          value={formatCurrency(balance)}
          tone={balance >= 0 ? 'success' : 'danger'}
        />
        <Stat
          label={liquidityAvailable !== undefined ? 'Caixa disponível' : 'Utilização do crédito'}
          value={
            liquidityAvailable !== undefined
              ? formatCurrency(liquidityAvailable)
              : creditPct !== undefined
                ? `${creditPct.toFixed(1)}%`
                : '—'
          }
        />
      </Stack>

      <DocCard header="Receita × despesa (R$)" footer="Totais do período.">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={periodCompareData}
              barCategoryGap="32%"
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
                  <ChartAxisTick {...props} fill={chartTheme.tick.fill} textAnchor="end" dx={-4} />
                )}
                width={56}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip {...tooltipProps} />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                maxBarSize={56}
                animationDuration={700}
                animationBegin={80}
              >
                {periodCompareData.map((entry) => (
                  <Cell key={entry.label} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DocCard>

      <DocCard header="Folga do período (R$)" footer="Folga = receita − despesa.">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={folgaChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={(props) => <ChartAxisTick {...props} fill={chartTheme.tick.fill} dy={10} />}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={(props) => (
                  <ChartAxisTick {...props} fill={chartTheme.tick.fill} textAnchor="end" dx={-4} />
                )}
                width={56}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip {...tooltipProps} />
              <Bar
                dataKey="folga"
                radius={[6, 6, 6, 6]}
                maxBarSize={40}
                animationDuration={700}
                animationBegin={120}
              >
                {folgaChartData.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.folga >= 0 ? chartTheme.folgaPos : chartTheme.folgaNeg}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DocCard>

      {categoryPie.length > 0 ? (
        <DocCard header="Destino das despesas (topo)">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke={chartTheme.pieStroke}
                  strokeWidth={2}
                  animationDuration={700}
                  animationBegin={100}
                >
                  {categoryPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke={chartTheme.pieStroke} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={chartTheme.tooltip}
                  labelStyle={chartTheme.tooltipLabel}
                  itemStyle={chartTheme.tooltipItem}
                  formatter={formatTooltipCurrency}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DocCard>
      ) : null}
    </Stack>
  );
}

export type { FlowPoint };
