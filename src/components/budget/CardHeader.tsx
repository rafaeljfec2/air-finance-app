import React from 'react';

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ icon, title, children }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 p-2 min-w-[32px] min-h-[32px]">
        {icon}
      </span>
      <span className="text-base font-semibold text-text dark:text-text-dark leading-tight">
        {title}
      </span>
    </div>
    {children && <div className="flex justify-end mt-2">{children}</div>}
  </div>
);
