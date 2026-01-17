import { Tooltip } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import React from 'react';

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  tooltip?: string;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  icon, 
  title, 
  tooltip, 
  children, 
  isCollapsed, 
  onToggleCollapse 
}) => (
  <div className="mb-1">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 p-1 min-w-[28px] min-h-[28px]">
          {icon}
        </span>
        <span className="text-base font-semibold text-text dark:text-text-dark leading-tight">
          {title}
        </span>
        {tooltip && (
          <Tooltip content={<p className="max-w-xs">{tooltip}</p>} className="text-sm">
             <Info className="h-4 w-4 text-muted-foreground hover:text-primary-500 cursor-help transition-colors" />
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            aria-label={isCollapsed ? "Expandir card" : "Colapsar card"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400 transition-colors" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400 transition-colors" />
            )}
          </button>
        )}
      </div>
    </div>
  </div>
);
