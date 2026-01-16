import { cn } from '@/lib/utils';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarOverlay({ isOpen, onClose }: Readonly<SidebarOverlayProps>) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity lg:hidden',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
