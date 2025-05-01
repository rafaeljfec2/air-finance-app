import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showSlogan?: boolean
  variant?: 'default' | 'white'
}

export function Logo({ className, showSlogan = false, variant = 'default' }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="flex items-center gap-2">
        {/* Ícone */}
        <div className="relative">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              'w-8 h-8',
              variant === 'white' ? 'text-white' : 'text-brand-leaf'
            )}
          >
            {/* Folha */}
            <path
              d="M7 24C7 24 16 24 16 16C16 8 25 8 25 8C25 8 16 8 16 16C16 24 7 24 7 24Z"
              fill="currentColor"
            />
            {/* Seta */}
            <path
              d="M13 19L19 13M19 13H15M19 13V17"
              stroke={variant === 'white' ? 'white' : '#2D6B4E'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Texto "Finely" */}
        <h1 
          className={cn(
            'text-2xl font-bold',
            variant === 'white' ? 'text-white' : 'text-brand-arrow dark:text-brand-leaf'
          )}
        >
          Finely
        </h1>
      </div>

      {/* Slogan */}
      {showSlogan && (
        <p 
          className={cn(
            'text-sm mt-1',
            variant === 'white' ? 'text-white/80' : 'text-brand-arrow/80 dark:text-brand-leaf/80'
          )}
        >
          Finanças simples, vida leve.
        </p>
      )}
    </div>
  )
} 