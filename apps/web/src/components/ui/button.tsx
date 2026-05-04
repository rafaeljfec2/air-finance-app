import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background dark:ring-offset-background-dark',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-border-dark dark:bg-background-dark':
              variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400':
              variant === 'success',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400': variant === 'destructive',
          },
          {
            'min-h-[44px] px-4 py-2.5 text-sm': size === 'sm',
            'min-h-[44px] px-4 py-3': size === 'md',
            'min-h-[44px] px-8 py-4 text-lg': size === 'lg',
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
