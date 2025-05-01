import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary-500 text-white hover:bg-primary-600': variant === 'default',
            'border border-border dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark': variant === 'outline',
            'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark': variant === 'ghost',
          },
          'h-10 px-4 py-2',
          className
        )}
        {...props}
      />
    )
  }
) 