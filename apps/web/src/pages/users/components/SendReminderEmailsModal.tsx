import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/toast';
import {
  sendReminderEmails,
  type ReminderEmailType,
  type SendReminderEmailsResult,
} from '@/services/userService';
import { Loader2, Mail } from 'lucide-react';
import { useCallback, useState } from 'react';

interface SendReminderEmailsModalProps {
  open: boolean;
  onClose: () => void;
}

const REMINDER_OPTIONS: { value: ReminderEmailType; label: string }[] = [
  { value: 'verification', label: 'E-mail não verificado' },
  { value: 'onboarding', label: 'Onboarding não concluído' },
  { value: 'both', label: 'Ambos' },
];

function formatResult(result: SendReminderEmailsResult, type: ReminderEmailType): string {
  if (type === 'verification') {
    return `${result.sentVerification} e-mail(s) de verificação enviado(s).`;
  }
  if (type === 'onboarding') {
    return `${result.sentOnboarding} e-mail(s) de onboarding enviado(s).`;
  }
  const parts: string[] = [];
  if (result.sentVerification > 0) parts.push(`${result.sentVerification} verificação(ões)`);
  if (result.sentOnboarding > 0) parts.push(`${result.sentOnboarding} onboarding`);
  return parts.length > 0
    ? `Enviado(s): ${parts.join(', ')}.`
    : 'Nenhum e-mail enviado (não há destinatários elegíveis).';
}

export function SendReminderEmailsModal({ open, onClose }: Readonly<SendReminderEmailsModalProps>) {
  const [type, setType] = useState<ReminderEmailType>('both');
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async () => {
    setIsSending(true);
    try {
      const result = await sendReminderEmails(type);
      const message = formatResult(result, type);
      toast.success(message);
      onClose();
    } catch {
      toast.error('Falha ao enviar e-mails de lembrete. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  }, [type, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Enviar e-mails de lembrete" className="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-text dark:text-text-dark opacity-90">
          Escolha o tipo de lembrete para enviar aos usuários elegíveis.
        </p>
        <div className="space-y-2">
          {REMINDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 p-3 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark cursor-pointer hover:bg-muted/50 dark:hover:bg-muted-dark/50 transition-colors"
            >
              <input
                type="radio"
                name="reminderType"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value)}
                className="h-4 w-4 text-primary-500 accent-primary-500"
              />
              <span className="text-sm font-medium text-text dark:text-text-dark">{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSending}
            className="border border-border dark:border-border-dark text-text dark:text-text-dark bg-background dark:bg-background-dark hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-400 dark:hover:bg-primary-500"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
