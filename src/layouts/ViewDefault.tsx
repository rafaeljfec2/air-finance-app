import { ReactNode, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebarStore } from '@/stores/sidebar';
import { cn } from '@/lib/utils';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface ViewDefaultProps {
  children: ReactNode;
}

export function ViewDefault({ children }: Readonly<ViewDefaultProps>) {
  const isCollapsed = useSidebarStore(state => state.isCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Header />
      
      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block fixed left-0 h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>

        {/* Mobile sidebar */}
        <aside
          className={cn(
            'lg:hidden fixed inset-0 z-40 transform',
            'transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="relative h-full">
            <div className="h-full bg-black bg-opacity-25" onClick={toggleMobileMenu} />
            <div className="absolute top-0 left-0 h-full w-64 bg-card dark:bg-card-dark">
              <Sidebar />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={cn(
            'flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300',
            'w-full',
            {
              'lg:ml-16': isCollapsed,
              'lg:ml-64': !isCollapsed
            }
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

