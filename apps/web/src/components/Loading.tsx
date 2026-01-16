import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'small' | 'large';
  className?: string;
  children?: React.ReactNode;
}

export const Loading = ({ size = 'small', className, children }: LoadingProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full h-full min-h-[200px]',
        className,
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary-500',
          size === 'small' ? 'h-4 w-4' : 'h-8 w-8',
        )}
      />
      {children && <div className="mt-4 text-base text-gray-500">{children}</div>}
    </div>
  );
};
