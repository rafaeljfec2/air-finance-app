import React from 'react';

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ icon, title, children }) => (
  <div className="flex flex-row items-center justify-between w-full min-h-[48px] gap-4 mb-2">
    <div className="flex flex-row items-center gap-3 min-w-0">
      <span className="inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 p-2 min-w-[40px] min-h-[40px]">
        {icon}
      </span>
      <span className="text-xl font-extrabold text-text dark:text-text-dark truncate">{title}</span>
    </div>
    {children && <div className="flex-shrink-0">{children}</div>}
  </div>
);
