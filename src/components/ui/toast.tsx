import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastStyles = {
  success: {
    bg: 'bg-green-100 dark:bg-green-950/90',
    border: 'border-l-green-600 dark:border-l-green-500',
    text: 'text-green-800 dark:text-green-50',
    icon: <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />,
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-950/90',
    border: 'border-l-red-600 dark:border-l-red-500',
    text: 'text-red-800 dark:text-red-50',
    icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />,
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-950/90',
    border: 'border-l-yellow-600 dark:border-l-yellow-500',
    text: 'text-yellow-800 dark:text-yellow-50',
    icon: <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />,
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-950/90',
    border: 'border-l-blue-600 dark:border-l-blue-500',
    text: 'text-blue-800 dark:text-blue-50',
    icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
  },
};

type ToastType = keyof typeof toastStyles;

export const toast = (props: { title?: string; description: string; type?: ToastType }) => {
  const { title, description, type = 'info' } = props;
  const styles = toastStyles[type];

  const ToastContent = () => (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg border border-border dark:border-border-dark',
        styles.bg,
        styles.border,
        'border-l-4',
      )}
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <div className="flex-1">
        {title && <h3 className={cn('text-sm font-medium mb-1', styles.text)}>{title}</h3>}
        <p className={cn('text-sm', styles.text)}>{description}</p>
      </div>
    </div>
  );

  sonnerToast.custom(ToastContent, {
    duration: 3000,
    position: 'top-right',
  });
};
