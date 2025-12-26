import { FinancialDashboard } from '@/components/reports/FinancialDashboard';
import { Insight } from '@/components/reports/InsightsCard';
import { Button } from '@/components/ui/button';
import { useMonthlyReport } from '@/hooks/useMonthlyReport';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useStatementStore } from '@/stores/statement';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';
import { ArrowLeft, ArrowRight, PieChart } from 'lucide-react';
import { useMemo } from 'react';

export function Reports() {
  const currentDate = new Date();
  const { date, report, previousMonth, nextMonth } = useMonthlyReport(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );
  
  const { transactions } = useStatementStore();

  // Calculate Historical Data (Last 6 Months)
  const historicalData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      const monthTrans = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === targetMonth && tDate.getFullYear() === targetYear;
      });

      const income = monthTrans.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
      const expenses = monthTrans.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

      data.push({
        date: targetDate.toISOString(),
        revenue: income,
        expenses: expenses,
        balance: income - expenses
      });
    }
    return data;
  }, [transactions]);

  // Generate Insights
  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];
    
    // 1. Balance Check
    if (report.balance.current < 0) {
      list.push({
        id: 'negative-balance',
        type: 'negative',
        title: 'Balanço Negativo',
        description: `Suas despesas superaram as receitas em ${formatCurrency(Math.abs(report.balance.current))} este mês.`
      });
    } else {
       list.push({
        id: 'positive-balance',
        type: 'positive',
        title: 'No Azul',
        description: `Parabéns! Você economizou ${formatCurrency(report.balance.current)} este mês.`
      });
    }

    // 2. High Expense Alert (Pareto top category)
    if (report.expenses.categories.length > 0) {
        // Sort to be sure
        const sortedCats = [...report.expenses.categories].sort((a,b) => b.value - a.value);
        const top = sortedCats[0];
        
        if (top && top.percentage > 30) {
            list.push({
                id: 'high-expense-cat',
                type: 'warning',
                title: `Atenção com ${top.name}`,
                description: `Esta categoria representa ${top.percentage.toFixed(0)}% das suas despesas totais.`
            });
        }
    }

    // 3. Trend Check (vs Last Month) - simplified using historicalData
    if (historicalData.length >= 2) {
        const currentMonthData = historicalData[historicalData.length - 1];
        const lastMonthData = historicalData[historicalData.length - 2];
        
        if (currentMonthData.expenses > lastMonthData.expenses * 1.2) {
             list.push({
                id: 'expense-spike',
                type: 'negative',
                title: 'Aumento de Gastos',
                description: 'Seus gastos aumentaram mais de 20% em comparação ao mês passado.'
            });
        }
    }

    return list;
  }, [report, historicalData]);

  return (
    <ViewDefault>
      <div className="space-y-6 px-4 sm:px-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Painel Financeiro
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visão estratégica para tomada de decisão
              </p>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex items-center justify-between sm:justify-end space-x-2">
            <Button
              variant="outline"
              onClick={previousMonth}
              className="p-2"
              aria-label="Mês anterior"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <span className="min-w-[120px] text-center text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              {formatMonthYear(date)}
            </span>
            <Button variant="outline" onClick={nextMonth} className="p-2" aria-label="Próximo mês">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* New Dashboard */}
        <FinancialDashboard 
            report={report} 
            historicalData={historicalData} 
            insights={insights} 
        />
      </div>
    </ViewDefault>
  );
}