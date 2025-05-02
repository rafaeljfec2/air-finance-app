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
  let valueClass = 'font-bold';
  if (positive) valueClass += ' text-green-600 dark:text-green-400';
  if (negative) valueClass += ' text-red-600 dark:text-red-400';
  if (highlight) valueClass += ' text-primary-600 dark:text-primary-400';

  return (
    <div className="flex justify-between items-center text-base">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={valueClass}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
};
