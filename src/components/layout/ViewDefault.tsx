import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface ViewDefaultProps {
  children: React.ReactNode;
  className?: string;
}

export function ViewDefault({ children, className }: ViewDefaultProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log('isSidebarOpen:', isSidebarOpen);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Header */}
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Layout Container */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'transition-all duration-300 ease-in-out',
            className,
          )}
        >
          <div className="max-w-4xl mx-auto w-full px-2 sm:px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
