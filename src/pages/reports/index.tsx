import { FinancialDashboard } from '@/components/reports/FinancialDashboard';
import { Insight } from '@/components/reports/InsightsCard';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ViewDefault } from '@/layouts/ViewDefault';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';
import { ArrowLeft, ArrowRight, PieChart } from 'lucide-react';
import { useMemo, useState } from 'react';

export function Reports() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Use the new hook
  const { 
    summary, 
    history, 
    goals,
    reportStructure, 
    loading, 
    error 
  } = useDashboardData({ 
      timeRange: 'month',
      referenceDate: currentDate.toISOString()
  });

  // Generate Insights based on the new data
  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];
    
    // 1. Balance Check
    if (summary.balance < 0) {
      list.push({
        id: 'negative-balance',
        type: 'negative',
        title: 'Balanço Negativo',
        description: `Suas despesas superaram as receitas em ${formatCurrency(Math.abs(summary.balance))} este mês.`
      });
    } else {
       list.push({
        id: 'positive-balance',
        type: 'positive',
        title: 'No Azul',
        description: `Parabéns! Você economizou ${formatCurrency(summary.balance)} este mês.`
      });
    }

    // 2. High Expense Alert (Pareto top category)
    if (reportStructure.expenses.categories.length > 0) {
        // Sort to be sure
        const sortedCats = [...reportStructure.expenses.categories].sort((a,b) => b.value - a.value);
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
    if (history.length >= 2) {
        const currentMonthData = history[history.length - 1];
        const lastMonthData = history[history.length - 2];
        
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
  }, [summary, reportStructure, history]);

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  if (loading) {
      return (
          <ViewDefault>
              <div className="flex items-center justify-center h-full min-h-[400px]">
                  <p className="text-muted-foreground">Carregando dados do relatório...</p>
              </div>
          </ViewDefault>
      )
  }

  if (error) {
    return (
        <ViewDefault>
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-red-500">Erro ao carregar dados: {error}</p>
            </div>
        </ViewDefault>
    )
  }

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
              {formatMonthYear(currentDate)}
            </span>
            <Button variant="outline" onClick={nextMonth} className="p-2" aria-label="Próximo mês">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* New Dashboard */}
        <FinancialDashboard 
            report={reportStructure} 
            historicalData={history} 
            insights={insights}
            goals={goals}
        />
      </div>
    </ViewDefault>
  );
}