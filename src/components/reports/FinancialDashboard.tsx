import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardGoalSummary } from '@/types/dashboard';
import { MonthlyReport } from '@/types/report';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { CashFlowChart } from './CashFlowChart';
import { ExpenseParetoChart } from './ExpenseParetoChart';
import { GoalsCard } from './GoalsCard';
import { Insight, InsightsCard } from './InsightsCard';

interface FinancialDashboardProps {
  report: MonthlyReport;
  historicalData: Array<{
    date: string;
    revenue: number;
    expenses: number;
    balance: number;
  }>;
  insights: Insight[];
  goals: DashboardGoalSummary[];
}

export function FinancialDashboard({ report, historicalData, insights, goals }: Readonly<FinancialDashboardProps>) {
  // Safe default for historical data if empty
  const safeHistoricalData = historicalData.length > 0 ? historicalData : [];
  
  // Transform expense categories for Pareto chart
  const paretoData = report.expenses.categories.map(cat => ({
    category: cat.name,
    amount: cat.value,
    percentage: cat.percentage
  })).sort((a, b) => b.amount - a.amount); // Sort desc for Pareto

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas (Mês)</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(report.income.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Total de entradas este mês
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(report.expenses.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Total de saídas este mês
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resultado (Mês)</CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${report.balance.current >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(report.balance.current)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Balanço do mês atual
                </p>
            </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart (Takes up 2/3) */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Fluxo de Caixa (Últimos 6 meses)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <CashFlowChart data={safeHistoricalData} />
            </CardContent>
        </Card>

        {/* Insights Panel (Takes up 1/3) */}
        <div className="lg:col-span-1">
            <InsightsCard insights={insights} className="h-full" />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Pareto Chart */}
         <Card>
            <CardHeader>
                <CardTitle>Maiores Despesas (Pareto)</CardTitle>
            </CardHeader>
             <CardContent className="h-[400px]">
                 <ExpenseParetoChart data={paretoData} />
             </CardContent>
         </Card>
         
         {/* Goals & Investments Tracker */}
         <GoalsCard goals={goals} />
      </div>
    </div>
  );
}
