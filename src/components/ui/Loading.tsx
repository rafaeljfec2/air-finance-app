import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'medium', children }) => (
  <div className="flex flex-col items-center justify-center min-h-[120px] w-full py-8">
    <div
      className={
        `animate-spin rounded-full border-4 border-primary-500 border-t-transparent ` +
        (size === 'small' ? 'h-6 w-6' : size === 'large' ? 'h-16 w-16' : 'h-10 w-10')
      }
      role="status"
      aria-label="Carregando"
    />
    {children && (
      <span className="mt-4 text-base text-text dark:text-text-dark text-center">{children}</span>
    )}
  </div>
);
