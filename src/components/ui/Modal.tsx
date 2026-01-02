import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  dismissible?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  dismissible = true,
}: Readonly<ModalProps>) {
  const modalRef = useRef<HTMLDialogElement>(null);

  // Fechar ao pressionar ESC
  useEffect(() => {
    if (!open || !dismissible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, dismissible]);

  // Foco automático
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={dismissible ? onClose : undefined}
      />
      {/* Modal content */}
      <dialog
        ref={modalRef}
        open={open}
        className={cn(
          'relative z-10 w-full max-w-lg mx-auto rounded-xl bg-white dark:bg-gray-900 shadow-xl p-4 sm:p-6 focus:outline-none border-0 max-h-[90vh] overflow-y-auto',
          className,
        )}
        aria-label={title}
      >
        {/* Close button */}
        {dismissible && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
            aria-label="Fechar"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {title && (
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 pr-8">
            {title}
          </h2>
        )}
        <div className={className?.includes('flex flex-col') ? 'flex flex-col h-full' : ''}>
          {children}
        </div>
      </dialog>
    </div>
  );
}
