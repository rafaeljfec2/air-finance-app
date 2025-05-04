import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { requestPasswordRecovery, isRecoveringPassword } = useAuth();

  function validateEmail(value: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Informe um e-mail válido');
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordRecovery({ email });
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar instruções. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm">
          <div className="p-8 relative">
            <div className="flex flex-col items-center mb-8">
              <Logo className="mb-4 w-16 h-16" />
              <h2 className="text-2xl font-bold text-brand-arrow mb-2">Recuperar senha</h2>
              <p className="text-text/60 dark:text-text-dark/60 text-center">
                Informe seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting || success}
                    className={error ? 'border-red-500 pl-10' : 'pl-10'}
                    placeholder="seu@email.com"
                  />
                </div>
                {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-3 text-lg mt-2"
                disabled={submitting || isRecoveringPassword || success}
              >
                {submitting || isRecoveringPassword ? 'Enviando...' : 'Enviar instruções'}
              </Button>
              {success && (
                <div className="flex items-center gap-2 text-green-600 mt-2 justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                  Se existir uma conta para este e-mail, você receberá as instruções em instantes.
                </div>
              )}
            </form>
            <div className="mt-8 text-center text-sm text-text/60 dark:text-text-dark/60">
              <button
                type="button"
                className="text-brand-arrow hover:underline font-medium"
                onClick={() => navigate('/login')}
              >
                Voltar para o login
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
