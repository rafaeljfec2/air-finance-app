import React from 'react';

interface CardTotalProps {
  value: number;
  color?: 'emerald' | 'amber' | 'rose' | 'violet';
  label?: string;
}

const colorMap = {
  emerald: 'text-green-600 dark:text-green-400',
  amber: 'text-amber-500 dark:text-amber-400',
  rose: 'text-red-600 dark:text-red-400',
  violet: 'text-primary-600 dark:text-primary-400',
};

export const CardTotal: React.FC<CardTotalProps> = ({ value, color = 'emerald', label }) => (
  <div className="flex items-center justify-between mb-4 mt-2">
    {label && <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>}
    <span className={`text-2xl font-extrabold ${colorMap[color]}`}>
      R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    </span>
  </div>
);
