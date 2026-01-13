import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import { Eye } from 'lucide-react';

interface ViewDefaultProps {
  children: React.ReactNode;
  className?: string;
}

export function ViewDefault({ children, className }: ViewDefaultProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isHeaderVisible = usePreferencesStore((state) => state.isHeaderVisible);
  const toggleHeaderVisibility = usePreferencesStore((state) => state.toggleHeaderVisibility);

  console.log('isSidebarOpen:', isSidebarOpen);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Header */}
      {isHeaderVisible && <Header onOpenSidebar={() => setIsSidebarOpen(true)} />}

      {/* Botão flutuante para mostrar header quando estiver escondido */}
      {!isHeaderVisible && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleHeaderVisibility}
            className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform active:scale-95 flex items-center justify-center"
            aria-label="Mostrar Header"
            title="Mostrar Header"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Layout Container */}
      <div
        className={cn(
          'flex transition-all duration-300',
          isHeaderVisible ? 'h-[calc(100vh-4rem)]' : 'h-screen',
        )}
      >
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
