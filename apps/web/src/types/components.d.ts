declare module '@/components/ui/tabs' {
  import * as React from 'react';
  import * as TabsPrimitive from '@radix-ui/react-tabs';

  interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
    className?: string;
  }

  interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
    className?: string;
  }

  interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    className?: string;
  }

  interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
    className?: string;
  }

  export const Tabs: React.ForwardRefExoticComponent<
    TabsProps & React.RefAttributes<HTMLDivElement>
  >;
  export const TabsList: React.ForwardRefExoticComponent<
    TabsListProps & React.RefAttributes<HTMLDivElement>
  >;
  export const TabsTrigger: React.ForwardRefExoticComponent<
    TabsTriggerProps & React.RefAttributes<HTMLButtonElement>
  >;
  export const TabsContent: React.ForwardRefExoticComponent<
    TabsContentProps & React.RefAttributes<HTMLDivElement>
  >;
}
