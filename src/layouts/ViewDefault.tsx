import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface ViewDefaultProps {
  children: ReactNode;
}

export function ViewDefault({ children }: ViewDefaultProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] relative">
        <aside className="fixed left-0 h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto p-6 ml-64">{children}</main>
      </div>
    </div>
  );
}
