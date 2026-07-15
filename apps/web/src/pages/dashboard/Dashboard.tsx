import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo, useState } from 'react';
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

import { Button } from '@/components/ui/button';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import type { DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

import { useFinancialHealthCheckup } from './hooks/useFinancialHealthCheckup';
import {
  Callout,
  ChartAxisTick,
  Divider,
  DocCard,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Stack,
  Stat,
  Text,
  useLaudoChartTheme,
} from './laudo-layout/primitives';
import type { CapacityState } from './types';
import { CAPACITY_STATE_LABEL } from './types';

const CHART_INCOME = '#2D6B4E';
const CHART_EXPENSE = '#8CCFB0';
const CHART_FOLGA_POS = '#4aaf7d';
const CHART_FOLGA_NEG = '#6b7280';

/** Distinct palette for light/dark — avoids monochrome brand greens. */
const CATEGORY_FALLBACK_COLORS = [
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
] as const;

const CATEGORY_COLOR_BY_NAME: Readonly<Record<string, string>> = {
  carro: '#6366F1',
  transporte: '#3B82F6',
  moradia: '#EF4444',
  alimentacao: '#F59E0B',
  internet: '#06B6D4',
  saude: '#EC4899',
  servicos: '#8B5CF6',
  outros: '#94A3B8',
  doacoes: '#10B981',
  lazer: '#A855F7',
  educacao: '#0EA5E9',
  vestuario: '#F43F5E',
};

function normalizeCategoryKey(name: string): string {
  return name.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

function isCssHexColor(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function resolveCategoryColor(apiColor: string | undefined, name: string, index: number): string {
  const semantic = CATEGORY_COLOR_BY_NAME[normalizeCategoryKey(name)];
  if (semantic) {
    return semantic;
  }
  const fromApi = apiColor?.trim() ?? '';
  if (isCssHexColor(fromApi)) {
    return fromApi;
  }
  return CATEGORY_FALLBACK_COLORS[index % CATEGORY_FALLBACK_COLORS.length];
}

function stateTone(state: CapacityState): 'neutral' | 'info' | 'warning' | 'success' | 'danger' {
  switch (state) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'attention':
      return 'warning';
    case 'critical':
      return 'danger';
    case 'inconclusive':
      return 'info';
    default:
      return 'neutral';
  }
}

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

/** Financial Health `/dashboard` — canvas v5 document layout + live data. */
export function Dashboard() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: new Date().toISOString(),
    }),
    [],
  );

  const {
    checkup,
    isLoading,
    isError,
    isPartial,
    refetch,
    summary,
    balanceHistory,
    expensesByCategory,
    indebtedness,
  } = useFinancialHealthCheckup(companyId, filters);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['indebtedness'] }),
      refetch(),
    ]);
    setIsRefreshing(false);
  };

  const periodLabel = useMemo(() => {
    const start = summary.data?.periodStart;
    if (!start) {
      return format(new Date(), 'MMM yyyy', { locale: ptBR });
    }
    return format(new Date(start), 'MMM yyyy', { locale: ptBR });
  }, [summary.data?.periodStart]);

  const periodCompareData = useMemo(() => {
    if (!summary.data) {
      return [];
    }
    return [
      { label: 'Receita', value: Math.round(summary.data.income), fill: CHART_INCOME },
      { label: 'Despesa', value: Math.round(summary.data.expenses), fill: CHART_EXPENSE },
    ];
  }, [summary.data]);

  const flowChartData = useMemo((): FlowPoint[] => {
    const points = balanceHistory.data ?? [];
    if (points.length === 0 && summary.data) {
      return [
        {
          label: periodLabel,
          income: Math.round(summary.data.income),
          expenses: Math.round(summary.data.expenses),
        },
      ];
    }
    return points.map((point) => ({
      label: format(new Date(point.date), 'dd/MM', { locale: ptBR }),
      income: Math.round(point.income),
      expenses: Math.round(point.expenses),
    }));
  }, [balanceHistory.data, summary.data, periodLabel]);

  const folgaChartData = useMemo(() => buildActivityFolga(flowChartData), [flowChartData]);

  const categoryPie = useMemo(() => {
    const rows = expensesByCategory.data ?? [];
    const mapped = rows.slice(0, 8).map((row, index) => ({
      name: row.name,
      value: Math.round(row.value),
      color: resolveCategoryColor(row.color, row.name, index),
    }));
    const total = mapped.reduce((acc, row) => acc + row.value, 0);
    return mapped.map((row) => ({
      ...row,
      share: total > 0 ? Math.round((row.value / total) * 100) : 0,
    }));
  }, [expensesByCategory.data]);

  const income = summary.data?.income ?? 0;
  const expenses = summary.data?.expenses ?? 0;
  const balance = summary.data?.balance ?? 0;
  const liquidity = indebtedness.data?.liquidity.available;
  const creditPct = indebtedness.data?.creditUtilization.percentage;
  const chartTheme = useLaudoChartTheme();

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="mx-auto w-full max-w-[1080px] p-4 pb-16 sm:p-6 lg:p-8">
          {!companyId ? (
            <Callout tone="neutral">
              Selecione um contexto para montar a leitura de capacidade do sistema.
            </Callout>
          ) : null}

          {companyId && isLoading ? (
            <Stack gap={16}>
              <Skeleton className="h-10 w-3/4 bg-muted/30" />
              <Skeleton className="h-20 w-full bg-muted/20" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Skeleton className="h-20 bg-muted/20" />
                <Skeleton className="h-20 bg-muted/20" />
                <Skeleton className="h-20 bg-muted/20" />
                <Skeleton className="h-20 bg-muted/20" />
              </div>
            </Stack>
          ) : null}

          {companyId && isError && !checkup ? (
            <Stack gap={12}>
              <Callout tone="warning">
                Não foi possível carregar os sinais de capacidade neste momento.
              </Callout>
              <Button type="button" variant="outline" onClick={() => void handleRefresh()}>
                Tentar novamente
              </Button>
            </Stack>
          ) : null}

          {checkup ? (
            <Stack gap={32}>
              <Stack gap={12}>
                <Stack gap={8}>
                  <H1>Capacidade do sistema financeiro — {periodLabel}</H1>
                  <Text tone="secondary">
                    Leitura sistêmica · dados ao vivo · layout do laudo executivo (canvas v5). Sem
                    Recommendation, Planner ou parecer do dia.
                  </Text>
                </Stack>
                <Callout tone="info">
                  Esta superfície analisa a capacidade de um sistema financeiro vivo — não julga uma
                  pessoa. Expressões de identidade permanente são evitadas; hipóteses são
                  revisáveis.
                </Callout>
                <RowPills checkup={checkup} />
                {isPartial ? (
                  <Text size="small" tone="secondary">
                    Lacunas declaradas (Inconclusivo) quando o sinal é proxy — sem inventar
                    Excelente.
                  </Text>
                ) : null}
              </Stack>

              <Grid columns={4} gap={16}>
                <Stat label="Receita do período" value={formatCurrency(income)} />
                <Stat label="Despesa do período" value={formatCurrency(expenses)} tone="warning" />
                <Stat
                  label="Resultado"
                  value={formatCurrency(balance)}
                  tone={balance >= 0 ? 'success' : 'danger'}
                />
                <Stat
                  label={liquidity !== undefined ? 'Caixa disponível' : 'Utilização do crédito'}
                  value={
                    liquidity !== undefined
                      ? formatCurrency(liquidity)
                      : creditPct !== undefined
                        ? `${creditPct.toFixed(1)}%`
                        : '—'
                  }
                />
              </Grid>

              <Stack gap={16}>
                <Stack gap={4}>
                  <H2>Leituras visuais</H2>
                  <Text size="small" tone="secondary">
                    Source: dados ao vivo da company · período {periodLabel}.
                  </Text>
                </Stack>
                <Grid columns={2} gap={16}>
                  <DocCard
                    header="Receita × despesa (R$)"
                    footer="Totais do período — leitura executiva, não diária."
                  >
                    <div className="h-[240px] w-full text-text dark:text-text-dark">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={periodCompareData} barCategoryGap="28%">
                          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                          <XAxis
                            dataKey="label"
                            tick={(props) => (
                              <ChartAxisTick
                                {...props}
                                fill={chartTheme.tick.fill}
                                fontSize={chartTheme.tick.fontSize}
                                opacity={chartTheme.tick.opacity}
                                dy={10}
                              />
                            )}
                            stroke={chartTheme.tick.fill}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={(props) => (
                              <ChartAxisTick
                                {...props}
                                fill={chartTheme.tick.fill}
                                fontSize={chartTheme.tick.fontSize}
                                opacity={chartTheme.tick.opacity}
                                textAnchor="end"
                                dx={-4}
                              />
                            )}
                            stroke={chartTheme.tick.fill}
                            width={56}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={chartTheme.tooltip}
                            labelStyle={{ color: chartTheme.tooltip.color }}
                            itemStyle={{ color: chartTheme.tooltip.color }}
                            cursor={{ fill: chartTheme.cursor, opacity: 0.35 }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {periodCompareData.map((entry) => (
                              <Cell key={entry.label} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </DocCard>
                  <DocCard
                    header="Folga do período (R$)"
                    footer="Folga = receita − despesa nos dias com movimento."
                  >
                    <div className="h-[240px] w-full text-text dark:text-text-dark">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={folgaChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                          <XAxis
                            dataKey="label"
                            tick={(props) => (
                              <ChartAxisTick
                                {...props}
                                fill={chartTheme.tick.fill}
                                fontSize={chartTheme.tick.fontSize}
                                opacity={chartTheme.tick.opacity}
                                dy={10}
                              />
                            )}
                            stroke={chartTheme.tick.fill}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={(props) => (
                              <ChartAxisTick
                                {...props}
                                fill={chartTheme.tick.fill}
                                fontSize={chartTheme.tick.fontSize}
                                opacity={chartTheme.tick.opacity}
                                textAnchor="end"
                                dx={-4}
                              />
                            )}
                            stroke={chartTheme.tick.fill}
                            width={56}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={chartTheme.tooltip}
                            labelStyle={{ color: chartTheme.tooltip.color }}
                            itemStyle={{ color: chartTheme.tooltip.color }}
                            cursor={{ fill: chartTheme.cursor, opacity: 0.35 }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Bar dataKey="folga" name="Folga" radius={[4, 4, 0, 0]}>
                            {folgaChartData.map((entry) => (
                              <Cell
                                key={entry.label}
                                fill={entry.folga >= 0 ? CHART_FOLGA_POS : CHART_FOLGA_NEG}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </DocCard>
                </Grid>
                {categoryPie.length > 0 ? (
                  <Grid columns={2} gap={16}>
                    <DocCard header="Destino das despesas (topo)">
                      <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryPie}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={52}
                              outerRadius={92}
                              paddingAngle={2}
                            >
                              {categoryPie.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={chartTheme.tooltip}
                              formatter={(value: number) => formatCurrency(value)}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </DocCard>
                    <DocCard header="Composição (topo)" footer="Percentuais sobre o topo exibido.">
                      <Stack gap={8}>
                        {categoryPie.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="truncate text-text dark:text-text-dark">
                                {entry.name}
                              </span>
                            </div>
                            <span className="shrink-0 tabular-nums text-muted-foreground">
                              {entry.share}% · {formatCurrency(entry.value)}
                            </span>
                          </div>
                        ))}
                      </Stack>
                    </DocCard>
                  </Grid>
                ) : null}
              </Stack>

              <Divider />

              <Stack gap={12}>
                <H2>Estado atual do sistema financeiro</H2>
                <DocCard>
                  <Stack gap={12}>
                    <Text>
                      <Text as="span" weight="semibold">
                        1. Estado sustentado pelos dados.{' '}
                      </Text>
                      {checkup.closingSynthesis}
                    </Text>
                    <Text>
                      <Text as="span" weight="semibold">
                        2. Principal ativo hoje.{' '}
                      </Text>
                      Previsibilidade e legibilidade dos sinais disponíveis — mesmo quando algum
                      pilar permanece inconclusivo.
                    </Text>
                    <Text>
                      <Text as="span" weight="semibold">
                        3. Principal tensão hoje.{' '}
                      </Text>
                      {checkup.hasCriticalBase
                        ? 'Liquidez e/ou fluxo em estado crítico orientam a leitura; demais pilares contextualizam.'
                        : 'A tensão dominante, quando existe, aparece nos pilares em Atenção ou Crítica abaixo.'}
                    </Text>
                    <Text>
                      <Text as="span" weight="semibold">
                        4. Se nada mudar…{' '}
                      </Text>
                      A direção permanece a capacidade atual do sistema — sem previsão de colapso e
                      sem decisão prescrita nesta superfície.
                    </Text>
                  </Stack>
                </DocCard>
              </Stack>

              <Divider />

              <Stack gap={10}>
                <H2>Padrão de capacidade (seis pilares)</H2>
                <Text tone="secondary">
                  Ordem canônica: Liquidez → Fluxo → Estrutura → Crédito → Resiliência → Patrimônio.
                </Text>
                <RowPills checkup={checkup} />
              </Stack>

              {checkup.pillars.map((pillar) => (
                <Stack key={pillar.id} gap={12}>
                  <Divider />
                  <Stack gap={8}>
                    <div className="flex flex-wrap items-center gap-2">
                      <H2>{pillar.name}</H2>
                      <Pill tone={stateTone(pillar.state)}>
                        {CAPACITY_STATE_LABEL[pillar.state]}
                      </Pill>
                    </div>
                    <Text weight="semibold">{pillar.question}</Text>
                    <Grid columns={2} gap={12}>
                      <Stat
                        label={pillar.primaryLabel}
                        value={pillar.primaryFormatted ?? '—'}
                        tone={
                          pillar.state === 'critical'
                            ? 'danger'
                            : pillar.state === 'attention'
                              ? 'warning'
                              : pillar.state === 'excellent' || pillar.state === 'good'
                                ? 'success'
                                : 'default'
                        }
                      />
                      <DocCard>
                        <Stack gap={8}>
                          <H3>Interpretação</H3>
                          <Text>{pillar.interpretation}</Text>
                          {pillar.hasGap ? (
                            <Callout tone="warning">
                              Lacuna declarada: leitura parcial ou proxy — sem inventar certeza.
                            </Callout>
                          ) : null}
                        </Stack>
                      </DocCard>
                    </Grid>
                    <Grid columns={2} gap={12}>
                      <DocCard header="O que faz melhorar">
                        <Stack gap={8}>
                          {pillar.influencers.improves.map((item) => (
                            <Text key={item}>· {item}</Text>
                          ))}
                        </Stack>
                      </DocCard>
                      <DocCard header="O que faz piorar">
                        <Stack gap={8}>
                          {pillar.influencers.worsens.map((item) => (
                            <Text key={item}>· {item}</Text>
                          ))}
                        </Stack>
                      </DocCard>
                    </Grid>
                    <Text size="small" tone="secondary">
                      Conexões: {pillar.connections.join(' · ')}
                    </Text>
                    <Text weight="semibold">{pillar.summarySentence}</Text>
                    {pillar.exploreHint ? (
                      <Text size="small" tone="secondary">
                        Explorar: {pillar.exploreHint}
                      </Text>
                    ) : null}
                  </Stack>
                </Stack>
              ))}

              <Divider />

              <Stack gap={10}>
                <H2>Hipótese de capacidade</H2>
                <Callout tone="warning">{checkup.closingSynthesis}</Callout>
                <Text>
                  A hipótese amarra os pilares observados sem recomendar gesto do dia. Capacidade ≠
                  parecer da Home.
                </Text>
              </Stack>

              <Divider />

              <Stack gap={10}>
                <H2>Resumo executivo do sistema</H2>
                <DocCard>
                  <Stack gap={8}>
                    {checkup.pillars.map((pillar) => (
                      <Text key={pillar.id}>
                        <Text as="span" weight="semibold">
                          {pillar.name}:{' '}
                        </Text>
                        {CAPACITY_STATE_LABEL[pillar.state]}
                        {pillar.primaryFormatted ? ` · ${pillar.primaryFormatted}` : ''}
                      </Text>
                    ))}
                    <Text weight="semibold">{checkup.surfaceQuestion}</Text>
                  </Stack>
                </DocCard>
              </Stack>

              <Divider />

              <Stack gap={10}>
                <H2>Pergunta estratégica</H2>
                <Callout tone="info">{checkup.surfaceQuestion}</Callout>
                <Text size="small" tone="secondary">
                  Pergunta para orientar a leitura de capacidade — sem resposta prescrita; revisável
                  quando o sistema mudar. Sem Recommendation · sem Planner · sem substituir a Home.
                </Text>
              </Stack>
            </Stack>
          ) : null}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}

function RowPills({
  checkup,
}: {
  readonly checkup: NonNullable<ReturnType<typeof useFinancialHealthCheckup>['checkup']>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {checkup.pillars.map((pillar) => (
        <Pill key={pillar.id} tone={stateTone(pillar.state)}>
          {pillar.name}: {CAPACITY_STATE_LABEL[pillar.state]}
        </Pill>
      ))}
    </div>
  );
}
