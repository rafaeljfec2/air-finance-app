import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supportService } from '@/services/supportService';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'question',
    message: '',
    priority: 'normal',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supportService.createTicket({
        subject: formData.subject,
        category: formData.category as any,
        message: formData.message,
        priority: formData.priority as any,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ subject: '', category: 'question', message: '', priority: 'normal' });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Suporte Especializado"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-4">
          Como podemos ajudar? Nossa equipe responderá em breve.
        </p>

        {success ? (
          <div className="py-8 text-center text-green-600 dark:text-green-400">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                 <Send className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold">Solicitação Enviada!</h3>
            <p className="text-sm text-gray-500 mt-2">Recebemos sua mensagem e entraremos em contato.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de ajuda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Dúvida Geral</SelectItem>
                  <SelectItem value="bug">Relatar Problema (Bug)</SelectItem>
                  <SelectItem value="feature">Sugestão de Melhoria</SelectItem>
                  <SelectItem value="billing">Financeiro / Assinatura</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Resumo do problema"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
               <Label htmlFor="message">Mensagem</Label>
               <Textarea
                 id="message"
                 placeholder="Descreva detalhadamente o que aconteceu..."
                 className="min-h-[120px]"
                 value={formData.message}
                 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                 required
               />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !formData.subject || !formData.message}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Solicitação
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
