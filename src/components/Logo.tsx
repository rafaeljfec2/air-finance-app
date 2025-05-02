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
        {/* Ícone - Apenas a seta */}
        <div className="relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              'w-6 h-6',
              variant === 'white' ? 'text-white' : 'text-brand-arrow'
            )}
          >
            <path
              d="M5 19L19 5M19 5H9M19 5V15"
              stroke="currentColor"
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
            AirFinance
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