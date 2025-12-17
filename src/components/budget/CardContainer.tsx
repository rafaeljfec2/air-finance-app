import React from 'react';

interface CardContainerProps {
  color?: 'emerald' | 'amber' | 'rose' | 'violet';
  children: React.ReactNode;
  className?: string;
}

const colorMap = {
  emerald: 'border-emerald-500',
  amber: 'border-amber-400',
  rose: 'border-rose-500',
  violet: 'border-violet-500',
};

export const CardContainer: React.FC<CardContainerProps> = ({
  color = 'emerald',
  children,
  className,
}) => (
  <div
    className={`bg-card dark:bg-card-dark rounded-xl shadow-lg border-t-4 ${colorMap[color]} p-6 flex flex-col h-full flex-1 w-full max-w-full overflow-hidden ${className ?? ''}`}
  >
    {children}
  </div>
);
