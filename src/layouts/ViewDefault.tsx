import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebarStore } from '@/stores/sidebar';
import { cn } from '@/lib/utils';

interface ViewDefaultProps {
  children: ReactNode;
}

export function ViewDefault({ children }: Readonly<ViewDefaultProps>) {
  const isCollapsed = useSidebarStore(state => state.isCollapsed);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] relative">
        <aside className="fixed left-0 h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>
        <main
          className={cn(
            'flex-1 overflow-auto p-6 transition-all duration-300',
            isCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
