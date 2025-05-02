import React from 'react';

interface BadgeStatusProps {
  status?: 'success' | 'warning' | 'danger' | 'default';
  children: React.ReactNode;
}

const statusMap = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  default: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ status = 'default', children }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusMap[status]}`}>{children}</span>
);
