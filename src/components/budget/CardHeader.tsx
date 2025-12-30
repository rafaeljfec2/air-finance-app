import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import React from 'react';

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ icon, title, tooltip, children }) => (
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
      {children && <div className="flex items-center">{children}</div>}
    </div>
  </div>
);
