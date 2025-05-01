declare module '@/components/ui/tabs' {
  import * as React from 'react';
  
  interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
  }

  interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    className?: string;
  }

  export const Tabs: React.ForwardRefExoticComponent<TabsProps>;
  export const TabsList: React.ForwardRefExoticComponent<TabsListProps>;
  export const TabsTrigger: React.ForwardRefExoticComponent<TabsTriggerProps>;
} 