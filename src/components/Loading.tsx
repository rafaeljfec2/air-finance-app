import React from 'react';
import { useTheme } from '@/stores/useTheme';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'small' | 'large';
  className?: string;
}

export const Loading = ({ size = 'small', className }: LoadingProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary-500',
        size === 'small' ? 'h-4 w-4' : 'h-8 w-8',
        className,
      )}
    />
  );
};
