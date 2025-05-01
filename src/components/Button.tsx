import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700',
        variant === 'outline' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
