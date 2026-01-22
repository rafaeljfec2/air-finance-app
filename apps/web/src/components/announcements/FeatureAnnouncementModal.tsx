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

interface FeatureAnnouncementModalProps {
  readonly announcement: Announcement;
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onClose?: () => void;
  readonly isLoading?: boolean;
}

const getPriorityStyles = (priority: Announcement['priority']) => {
  switch (priority) {
    case 'urgent':
      return {
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        border: 'border-red-400',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800',
        button: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
      };
    case 'important':
      return {
        gradient: 'from-blue-500 via-purple-500 to-pink-500',
        border: 'border-blue-400',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-800',
        button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      };
    case 'normal':
    default:
      return {
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        border: 'border-green-400',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800',
        button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      };
  }
};

const getTypeIcon = (type: Announcement['type']) => {
  switch (type) {
    case 'welcome':
      return Sparkles;
    case 'feature':
      return CheckCircle2;
    case 'important':
      return AlertCircle;
    case 'update':
      return Megaphone;
    default:
      return Sparkles;
  }
};

const getTypeLabel = (type: Announcement['type']) => {
  switch (type) {
    case 'welcome':
      return 'Bem-vindo';
    case 'feature':
      return 'Nova Feature';
    case 'important':
      return 'Importante';
    case 'update':
      return 'Atualização';
    default:
      return 'Aviso';
  }
};

const getPriorityLabel = (priority: Announcement['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'Urgente';
    case 'important':
      return 'Importante';
    case 'normal':
    default:
      return 'Normal';
  }
};

export function FeatureAnnouncementModal({
  announcement,
  isOpen,
  onConfirm,
  onClose,
  isLoading = false,
}: Readonly<FeatureAnnouncementModalProps>) {
  if (!isOpen) return null;

  const styles = getPriorityStyles(announcement.priority);
  const TypeIcon = getTypeIcon(announcement.type);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay com blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className={cn(
            'relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl',
            'border-2',
            styles.border,
            'overflow-hidden',
          )}
        >
          {/* Header com gradiente */}
          <div className={cn('relative h-32 bg-gradient-to-r', styles.gradient)}>
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
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <TypeIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold border',
                  styles.badge,
                )}
              >
                {getTypeLabel(announcement.type)}
              </span>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold border',
                  styles.badge,
                )}
              >
                {getPriorityLabel(announcement.priority)}
              </span>
            </div>

            {/* Botão fechar (opcional) */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {announcement.title}
            </h2>

            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {announcement.description}
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              {announcement.actionButtonText && announcement.actionButtonLink && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (announcement.actionButtonLink?.startsWith('/')) {
                      window.location.href = announcement.actionButtonLink;
                    } else {
                      window.open(announcement.actionButtonLink, '_blank');
                    }
                  }}
                  className="flex-1 border-2"
                >
                  {announcement.actionButtonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn('flex-1 text-white shadow-lg', styles.button)}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Entendi, obrigado!
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
