import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  label: string;
  icon: LucideIcon;
  href: string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function QuickActionCard({
  label,
  icon: Icon,
  href,
  color = 'bg-primary-500',
  className,
  onClick,
}: QuickActionCardProps) {
  return (
    <Link
      to={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`flex flex-col items-center justify-center p-4 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-border dark:border-border-dark hover:shadow-md transition-all active:scale-95 ${className}`}
    >
      <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-1`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-[0.7rem] leading-3 font-medium text-center text-gray-700 dark:text-gray-300 line-clamp-2">
        {label}
      </span>
    </Link>
  );
}
