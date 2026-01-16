import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo } from 'react';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
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

interface MonthNavigatorProps {
  month: string; // '01' a '12'
  year: string; // '2024', etc
  onChange: (month: string, year: string) => void;
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({ month, year, onChange }) => {
  const monthIndex = Number.parseInt(month, 10) - 1;
  const currentYear = Number.parseInt(year, 10);

  const handlePrev = () => {
    let newMonth = monthIndex - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    onChange((newMonth + 1).toString().padStart(2, '0'), newYear.toString());
  };

  const handleNext = () => {
    let newMonth = monthIndex + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    onChange((newMonth + 1).toString().padStart(2, '0'), newYear.toString());
  };

  // Opções combinadas de mês/ano (ex: "Dezembro de 2025")
  const monthYearOptions: ComboBoxOption<string>[] = useMemo(() => {
    const currentYearNum = new Date().getFullYear();
    const options: ComboBoxOption<string>[] = [];

    // Criar opções para os últimos 10 anos e próximos 5 anos
    for (let y = currentYearNum - 10; y <= currentYearNum + 5; y++) {
      months.forEach((monthName, index) => {
        const monthValue = (index + 1).toString().padStart(2, '0');
        const value = `${monthValue}-${y}`; // Formato: "12-2025"
        const label = `${monthName} de ${y}`;
        options.push({ value, label });
      });
    }

    return options;
  }, []);

  // Valor atual no formato "MM-YYYY"
  const currentValue = useMemo(() => `${month}-${year}`, [month, year]);

  const handleMonthYearChange = (value: string | null) => {
    if (value) {
      const [newMonth, newYear] = value.split('-');
      onChange(newMonth, newYear);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 select-none bg-card dark:bg-card-dark rounded-xl shadow-md px-4 py-2 border border-border dark:border-border-dark">
      <button
        onClick={handlePrev}
        className="rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark min-h-[44px] min-w-[44px] p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors active:scale-95 flex-shrink-0 flex items-center justify-center"
        aria-label="Mês anterior"
        type="button"
      >
        <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
      </button>

      <ComboBox
        options={monthYearOptions}
        value={currentValue}
        onValueChange={handleMonthYearChange}
        placeholder="Selecione o mês/ano"
        searchable
        searchPlaceholder="Buscar mês/ano..."
        className="w-56 bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark"
        contentClassName="rounded-lg"
        maxHeight="max-h-64"
      />

      <button
        onClick={handleNext}
        className="rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark min-h-[44px] min-w-[44px] p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors active:scale-95 flex-shrink-0 flex items-center justify-center"
        aria-label="Próximo mês"
        type="button"
      >
        <ChevronRight className="h-5 w-5 text-text dark:text-text-dark" />
      </button>
    </div>
  );
};
