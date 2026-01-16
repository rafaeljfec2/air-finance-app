import React from 'react';
import { Separator } from '@/components/ui/separator';

interface ViewHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function ViewHeader({ title, description, actions }: ViewHeaderProps) {
  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <Separator />
    </div>
  );
}
