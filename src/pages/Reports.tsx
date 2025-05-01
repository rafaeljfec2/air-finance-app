import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useMonthlyReport } from '@/hooks/useMonthlyReport';
import { formatMonthYear } from '@/utils/formatters';
import { ArrowLeftIcon, ArrowRightIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/Button';
import { FinancialSummary } from '@/components/reports/FinancialSummary';
import { CategoryCharts } from '@/components/reports/CategoryCharts';
import { CategoryDetails } from '@/components/reports/CategoryDetails';
import { BalanceVariation } from '@/components/reports/BalanceVariation';
import { cn } from '@/lib/utils';

type ReportSection = 'summary' | 'charts' | 'details';

export function Reports() {
  const { date, report, isLoading, previousMonth, nextMonth } = useMonthlyReport();
  const [activeSection, setActiveSection] = useState<ReportSection>('summary');

  const sections: { id: ReportSection; label: string }[] = [
    { id: 'summary', label: 'Resumo' },
    { id: 'charts', label: 'Gráficos' },
    { id: 'details', label: 'Detalhes' },
  ];

  if (isLoading || !report) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <ChartPieIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Relatório Financeiro
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise detalhada das suas finanças
              </p>
            </div>
          </div>

          {/* Seletor de Mês */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={previousMonth}
              className="p-2"
              aria-label="Mês anterior"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <span className="min-w-[120px] text-center text-lg font-medium text-gray-900 dark:text-white">
              {formatMonthYear(date)}
            </span>
            <Button variant="outline" onClick={nextMonth} className="p-2" aria-label="Próximo mês">
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8" aria-label="Seções do relatório">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap',
                  activeSection === section.id
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                )}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          {activeSection === 'summary' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialSummary report={report} />
                <BalanceVariation report={report} />
              </div>
            </>
          )}

          {activeSection === 'charts' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <CategoryCharts report={report} />
              </div>
            </div>
          )}

          {activeSection === 'details' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <CategoryDetails report={report} />
            </div>
          )}
        </div>
      </div>
    </ViewDefault>
  );
}
