import React from 'react';

interface MonthYearFilterProps {
  month: string;
  year: string;
  onChange: (month: string, year: string) => void;
  className?: string;
}

const months = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

export const MonthYearFilter: React.FC<MonthYearFilterProps> = ({
  month,
  year,
  onChange,
  className,
}) => {
  return (
    <div className={`flex gap-2 items-center ${className ?? ''}`}>
      <select
        className="input input-bordered bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-primary-500"
        value={month}
        onChange={(e) => onChange(e.target.value, year)}
        aria-label="Mês"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <select
        className="input input-bordered bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-primary-500"
        value={year}
        onChange={(e) => onChange(month, e.target.value)}
        aria-label="Ano"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
