import React from 'react';

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ icon, title, children }) => (
  <div className="flex items-center justify-between gap-2 mb-2">
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 p-2">
        {icon}
      </span>
      <span className="text-lg font-bold text-text dark:text-text-dark">{title}</span>
    </div>
    {children && <div>{children}</div>}
  </div>
);
