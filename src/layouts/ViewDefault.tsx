import { ReactNode, useCallback, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebarStore } from '@/stores/sidebar';
import { cn } from '@/lib/utils';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { CompanySelectionModal } from '@/features/company/components/CompanySelectionModal';

interface ViewDefaultProps {
  children: ReactNode;
}

export function ViewDefault({ children }: Readonly<ViewDefaultProps>) {
  const isCollapsed = useSidebarStore(state => state.isCollapsed);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(current => !current);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Header onOpenSidebar={handleOpenSidebar} />
      <CompanySelectionModal />
      
      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={handleToggleSidebar}
          className="p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        <main
          className={cn(
            'flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300 w-full',
            isCollapsed ? 'lg:pl-6' : 'lg:pl-8'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

