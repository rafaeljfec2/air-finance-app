import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { ChartBarIcon, ChartPieIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

interface HistoricalData {
  name: string;
  value: number;
  date: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData | HistoricalData;
  }>;
}

const COLORS = [
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#3B82F6', // blue-500
  '#EC4899', // pink-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#14B8A6', // teal-500
  '#EF4444', // red-500
];

// Dados mockados para histórico
const mockHistoricalData = {
  income: [
    { name: 'Salário', value: 5000, date: '2024-01' },
    { name: 'Salário', value: 5200, date: '2024-02' },
    { name: 'Salário', value: 5500, date: '2024-03' },
    { name: 'Freelance', value: 1200, date: '2024-01' },
    { name: 'Freelance', value: 1500, date: '2024-02' },
    { name: 'Freelance', value: 1800, date: '2024-03' },
    { name: 'Investimentos', value: 800, date: '2024-01' },
    { name: 'Investimentos', value: 900, date: '2024-02' },
    { name: 'Investimentos', value: 1000, date: '2024-03' },
  ],
  expenses: [
    { name: 'Moradia', value: 1500, date: '2024-01' },
    { name: 'Moradia', value: 1500, date: '2024-02' },
    { name: 'Moradia', value: 1500, date: '2024-03' },
    { name: 'Alimentação', value: 800, date: '2024-01' },
    { name: 'Alimentação', value: 850, date: '2024-02' },
    { name: 'Alimentação', value: 900, date: '2024-03' },
    { name: 'Transporte', value: 500, date: '2024-01' },
    { name: 'Transporte', value: 550, date: '2024-02' },
    { name: 'Transporte', value: 600, date: '2024-03' },
    { name: 'Lazer', value: 300, date: '2024-01' },
    { name: 'Lazer', value: 350, date: '2024-02' },
    { name: 'Lazer', value: 400, date: '2024-03' },
  ],
};

type ChartType = 'pie' | 'bar' | 'line';

export function CategoryCharts() {
  const [chartType, setChartType] = useState<ChartType>('pie');

  // Dados mockados para teste
  const mockData = {
    income: [
      { name: 'Salário', value: 5000, percentage: 65 },
      { name: 'Freelance', value: 2000, percentage: 25 },
      { name: 'Investimentos', value: 800, percentage: 10 },
    ],
    expenses: [
      { name: 'Moradia', value: 2000, percentage: 40 },
      { name: 'Alimentação', value: 1500, percentage: 30 },
      { name: 'Transporte', value: 800, percentage: 20 },
      { name: 'Lazer', value: 500, percentage: 10 },
    ]
  };

  // Usar dados mockados ao invés dos dados do report
  const incomeData = mockData.income;
  const expensesData = mockData.expenses;

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.value)}
          </p>
          {'percentage' in data && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.percentage.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = (data: ChartData[], historicalData: HistoricalData[], _title: string, type: 'income' | 'expense') => {
    const chartMargin = { top: 20, right: 30, left: 20, bottom: 5 };

    switch (chartType) {
      case 'pie':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'bar':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL',
                    maximumFractionDigits: 0 
                  }).format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={type === 'income' ? '#10B981' : '#EF4444'} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL',
                    maximumFractionDigits: 0 
                  }).format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={type === 'income' ? '#10B981' : '#EF4444'} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Tipo de Gráfico */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setChartType('pie')}
          className={`p-2 rounded-lg transition-colors ${
            chartType === 'pie'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <ChartPieIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`p-2 rounded-lg transition-colors ${
            chartType === 'bar'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <ChartBarIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setChartType('line')}
          className={`p-2 rounded-lg transition-colors ${
            chartType === 'line'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <ArrowTrendingUpIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Receitas */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Receitas por Categoria
          </h2>
          {renderChart(incomeData, mockHistoricalData.income, 'Receitas por Categoria', 'income')}
        </div>

        {/* Gráfico de Despesas */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Despesas por Categoria
          </h2>
          {renderChart(expensesData, mockHistoricalData.expenses, 'Despesas por Categoria', 'expense')}
        </div>
      </div>
    </div>
  );
}
