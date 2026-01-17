import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardGoalSummary } from '@/types/dashboard';
import { MonthlyReport } from '@/types/report';
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
