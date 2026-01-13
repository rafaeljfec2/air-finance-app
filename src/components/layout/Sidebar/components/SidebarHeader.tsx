import { X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: Readonly<SidebarHeaderProps>) {
  return (
    <button
      className="absolute top-4 right-4 lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center"
      onClick={onClose}
      aria-label="Fechar menu"
    >
      <X className="h-6 w-6" />
    </button>
  );
}
