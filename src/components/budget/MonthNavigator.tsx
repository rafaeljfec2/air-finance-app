import React from 'react';

const months = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
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
    <div className="flex items-center justify-center gap-4 select-none">
      <button
        onClick={handlePrev}
        className="rounded bg-background dark:bg-background-dark border border-border dark:border-border-dark p-2 hover:bg-primary-900/10 transition-colors"
        aria-label="Mês anterior"
      >
        <span className="text-xl">←</span>
      </button>
      <span className="text-lg sm:text-xl font-semibold text-text dark:text-text-dark min-w-[120px] text-center">
        {months[monthIndex]} de {year}
      </span>
      <button
        onClick={handleNext}
        className="rounded bg-background dark:bg-background-dark border border-border dark:border-border-dark p-2 hover:bg-primary-900/10 transition-colors"
        aria-label="Próximo mês"
      >
        <span className="text-xl">→</span>
      </button>
    </div>
  );
};
