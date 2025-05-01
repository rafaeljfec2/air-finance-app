import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';

interface ViewDefaultProps {
  title?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function ViewDefault({ title, children, showBackButton = false }: ViewDefaultProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Icon name="ArrowLeftIcon" className="text-gray-500 dark:text-gray-400" size={20} />
                </button>
              )}
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
              )}
            </div>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
} 