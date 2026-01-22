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

const MODAL_STYLES_MOBILE = {
  maxHeight: 'calc(70vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))',
  height: 'auto',
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
    <div className={cn('relative h-16 sm:h-24 lg:h-24 bg-gradient-to-r flex-shrink-0', styles.gradient)}>
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
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-3 lg:p-3">
          <TypeIcon className="h-6 w-6 sm:h-10 sm:w-10 lg:h-10 lg:w-10 text-white" />
        </div>
      </div>

      <div
        className="absolute top-1.5 sm:top-4 left-1.5 sm:left-4 flex gap-1 sm:gap-2 flex-wrap"
        style={{ paddingTop: SAFE_AREA_STYLES.topPadding }}
      >
        <span
          className={cn(
            'px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold border',
            styles.badge,
          )}
        >
          {getTypeLabel(announcement.type)}
        </span>
        <span
          className={cn(
            'px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold border',
            styles.badge,
          )}
        >
          {getPriorityLabel(announcement.priority)}
        </span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1.5 sm:top-4 right-1.5 sm:right-4 text-white/80 hover:text-white transition-colors p-1 sm:p-2 rounded-full hover:bg-white/20 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
          style={{ paddingTop: SAFE_AREA_STYLES.topPadding }}
          aria-label="Fechar"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
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
      <div className="p-3 sm:p-4 lg:p-6">
        <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          {announcement.title}
        </h2>
        <div className="mb-2 sm:mb-4">
          <p className="text-xs sm:text-sm lg:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
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
      className="flex-shrink-0 p-3 sm:p-4 lg:p-4 pt-2 sm:pt-2 lg:pt-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
      style={{ paddingBottom: SAFE_AREA_STYLES.bottomPadding }}
    >
      <div className="flex flex-col gap-1.5 sm:gap-3">
        {announcement.actionButtonText && announcement.actionButtonLink && (
          <Button
            variant="outline"
            onClick={() => handleActionButtonClick(announcement.actionButtonLink!)}
            className="flex-1 border-2 min-h-[44px] sm:min-h-[44px] text-xs sm:text-sm font-semibold"
          >
            {announcement.actionButtonText}
            <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}

        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn('flex-1 text-white shadow-lg min-h-[44px] sm:min-h-[44px] text-xs sm:text-sm font-semibold', styles.button)}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2" />
              Processando...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-3.5 w-3.5 sm:h-5 sm:w-5" />
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-4">
        <ModalOverlay onClose={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className={cn(
            'relative z-10 w-full max-w-lg sm:max-w-2xl rounded-2xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl',
            'border-2 sm:border-2',
            styles.border,
            'overflow-hidden',
            'flex flex-col',
            'max-h-[70vh] sm:max-h-[85vh]',
          )}
          style={MODAL_STYLES_MOBILE}
        >
          <ModalHeader announcement={announcement} styles={styles} onClose={onClose} />
          <ModalContent announcement={announcement} />
          <ModalActions announcement={announcement} styles={styles} onConfirm={onConfirm} isLoading={isLoading} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
