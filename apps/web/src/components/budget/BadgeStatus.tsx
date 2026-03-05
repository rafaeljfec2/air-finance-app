import type React from 'react';

interface BadgeStatusProps {
  readonly status?: 'success' | 'warning' | 'danger' | 'default';
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
}

const statusMap = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  default: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  status = 'default',
  children,
  onClick,
  disabled,
}) => {
  const baseClasses = `px-2 py-0.5 rounded text-xs font-medium ${statusMap[status]}`;
  const interactiveClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-wait' : '';

  if (onClick) {
    return (
      <button
        type="button"
        className={`${baseClasses} ${interactiveClasses} ${disabledClasses}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return <span className={baseClasses}>{children}</span>;
};
