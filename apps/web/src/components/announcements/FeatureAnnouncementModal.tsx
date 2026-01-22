import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Announcement } from '@/services/announcementsService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Megaphone,
  ArrowRight,
  X,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface FeatureAnnouncementModalProps {
  readonly announcement: Announcement;
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onClose?: () => void;
  readonly isLoading?: boolean;
}

type PriorityStyle = {
  readonly gradient: string;
  readonly border: string;
  readonly badge: string;
  readonly button: string;
};

type AnnouncementType = Announcement['type'];
type AnnouncementPriority = Announcement['priority'];

const PRIORITY_STYLES: Record<AnnouncementPriority, PriorityStyle> = {
  urgent: {
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    border: 'border-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800',
    button: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
  },
  important: {
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    border: 'border-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-800',
    button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
  },
  normal: {
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    border: 'border-green-400',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800',
    button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
  },
};

const TYPE_ICONS: Record<AnnouncementType, LucideIcon> = {
  welcome: Sparkles,
  feature: CheckCircle2,
  important: AlertCircle,
  update: Megaphone,
};

const TYPE_LABELS: Record<AnnouncementType, string> = {
  welcome: 'Bem-vindo',
  feature: 'Nova Feature',
  important: 'Importante',
  update: 'Atualização',
};

const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  urgent: 'Urgente',
  important: 'Importante',
  normal: 'Normal',
};

const MODAL_STYLES = {
  height: 'calc(100dvh - 4rem - env(safe-area-inset-bottom, 0px))',
  maxHeight: 'calc(100dvh - 4rem - env(safe-area-inset-bottom, 0px))',
  marginBottom: 'max(calc(4rem + env(safe-area-inset-bottom, 0px)), 0px)',
} as const;

const SAFE_AREA_STYLES = {
  topPadding: 'env(safe-area-inset-top, 0px)',
  bottomPadding: 'max(calc(1rem + env(safe-area-inset-bottom, 0px)), 1rem)',
} as const;

const getPriorityStyles = (priority: AnnouncementPriority): PriorityStyle => {
  return PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.normal;
};

const getTypeIcon = (type: AnnouncementType): LucideIcon => {
  return TYPE_ICONS[type] ?? Sparkles;
};

const getTypeLabel = (type: AnnouncementType): string => {
  return TYPE_LABELS[type] ?? 'Aviso';
};

const getPriorityLabel = (priority: AnnouncementPriority): string => {
  return PRIORITY_LABELS[priority] ?? 'Normal';
};

const handleActionButtonClick = (link: string): void => {
  if (link.startsWith('/')) {
    const location = globalThis.location;
    if (location) {
      location.href = link;
    }
  } else {
    globalThis.open(link, '_blank');
  }
};

interface ModalOverlayProps {
  readonly onClose?: () => void;
}

function ModalOverlay({ onClose }: Readonly<ModalOverlayProps>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
  );
}

interface ModalHeaderProps {
  readonly announcement: Announcement;
  readonly styles: PriorityStyle;
  readonly onClose?: () => void;
}

function ModalHeader({ announcement, styles, onClose }: Readonly<ModalHeaderProps>) {
  const TypeIcon = getTypeIcon(announcement.type);

  return (
    <div className={cn('relative h-24 sm:h-32 bg-gradient-to-r flex-shrink-0', styles.gradient)}>
      {announcement.imageUrl && (
        <div className="absolute inset-0">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}
      <div className="relative h-full flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-4">
          <TypeIcon className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
        </div>
      </div>

      <div
        className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1.5 sm:gap-2 flex-wrap"
        style={{ paddingTop: SAFE_AREA_STYLES.topPadding }}
      >
        <span
          className={cn(
            'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border',
            styles.badge,
          )}
        >
          {getTypeLabel(announcement.type)}
        </span>
        <span
          className={cn(
            'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border',
            styles.badge,
          )}
        >
          {getPriorityLabel(announcement.priority)}
        </span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white/80 hover:text-white transition-colors p-1.5 sm:p-2 rounded-full hover:bg-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ paddingTop: SAFE_AREA_STYLES.topPadding }}
          aria-label="Fechar"
        >
          <X className="h-5 w-5 sm:h-5 sm:w-5" />
        </button>
      )}
    </div>
  );
}

interface ModalContentProps {
  readonly announcement: Announcement;
}

function ModalContent({ announcement }: Readonly<ModalContentProps>) {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
      <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {announcement.title}
        </h2>
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {announcement.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ModalActionsProps {
  readonly announcement: Announcement;
  readonly styles: PriorityStyle;
  readonly onConfirm: () => void;
  readonly isLoading: boolean;
}

function ModalActions({ announcement, styles, onConfirm, isLoading }: Readonly<ModalActionsProps>) {
  return (
    <div
      className="flex-shrink-0 p-4 sm:p-6 lg:p-8 pt-3 sm:pt-3 lg:pt-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
      style={{ paddingBottom: SAFE_AREA_STYLES.bottomPadding }}
    >
      <div className="flex flex-col gap-2 sm:gap-3">
        {announcement.actionButtonText && announcement.actionButtonLink && (
          <Button
            variant="outline"
            onClick={() => handleActionButtonClick(announcement.actionButtonLink!)}
            className="flex-1 border-2 min-h-[48px] text-sm sm:text-base font-semibold"
          >
            {announcement.actionButtonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn('flex-1 text-white shadow-lg min-h-[48px] text-sm sm:text-base font-semibold', styles.button)}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Processando...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Entendi, obrigado!
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function FeatureAnnouncementModal({
  announcement,
  isOpen,
  onConfirm,
  onClose,
  isLoading = false,
}: Readonly<FeatureAnnouncementModalProps>) {
  if (!isOpen) return null;

  const styles = getPriorityStyles(announcement.priority);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <ModalOverlay onClose={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 100 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className={cn(
            'relative z-10 w-full max-w-2xl rounded-t-3xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl',
            'border-2 sm:border-2',
            styles.border,
            'overflow-hidden',
            'flex flex-col',
            'mb-0 sm:mb-0',
          )}
          style={MODAL_STYLES}
        >
          <ModalHeader announcement={announcement} styles={styles} onClose={onClose} />
          <ModalContent announcement={announcement} />
          <ModalActions announcement={announcement} styles={styles} onConfirm={onConfirm} isLoading={isLoading} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
