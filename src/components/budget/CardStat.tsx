import React from 'react';

interface CardStatProps {
  label: string;
  value: number;
  positive?: boolean;
  negative?: boolean;
  highlight?: boolean;
}

export const CardStat: React.FC<CardStatProps> = ({
  label,
  value,
  positive,
  negative,
  highlight,
}) => {
  let valueClass = 'font-bold text-lg sm:text-xl text-gray-900 dark:text-white';
  if (positive) {
    valueClass = 'font-bold text-lg sm:text-xl text-green-600 dark:text-green-400';
  } else if (negative) {
    valueClass = 'font-bold text-lg sm:text-xl text-red-600 dark:text-red-400';
  } else if (highlight) {
    valueClass = 'font-bold text-lg sm:text-xl text-primary-600 dark:text-primary-400';
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
      <span className={valueClass}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
};
