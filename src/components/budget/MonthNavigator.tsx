import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

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
  const monthIndex = parseInt(month, 10) - 1;
  const handlePrev = () => {
    let newMonth = monthIndex - 1;
    let newYear = parseInt(year, 10);
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    onChange((newMonth + 1).toString().padStart(2, '0'), newYear.toString());
  };
  const handleNext = () => {
    let newMonth = monthIndex + 1;
    let newYear = parseInt(year, 10);
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    onChange((newMonth + 1).toString().padStart(2, '0'), newYear.toString());
  };
  return (
    <div className="flex items-center justify-center gap-4 select-none bg-card dark:bg-card-dark rounded-xl shadow-md px-4 py-2 border border-border dark:border-border-dark">
      <button
        onClick={handlePrev}
        className="rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors active:scale-95"
        aria-label="Mês anterior"
        type="button"
      >
        <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
      </button>
      <span className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark min-w-[140px] text-center drop-shadow-sm">
        {months[monthIndex]} de {year}
      </span>
      <button
        onClick={handleNext}
        className="rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors active:scale-95"
        aria-label="Próximo mês"
        type="button"
      >
        <ChevronRight className="h-5 w-5 text-text dark:text-text-dark" />
      </button>
    </div>
  );
};
