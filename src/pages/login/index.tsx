import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { apiClient } from '@/services/apiClient';
import { motion } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, Lock, Mail, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Resend Confirmation State
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  // Redireciona se já estiver autenticado (usando useEffect para evitar setState durante render)
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [isAuthenticated, location.state?.from?.pathname, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);

    login(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onError: (err: any) => {
          const status = err?.response?.status;
          const backendMsg = err?.response?.data?.message;

          if (status === 403 && backendMsg?.includes('verificado')) {
            setNeedsConfirmation(true);
            setError(null); // Clear generic error
            return;
          }

          setError(backendMsg || err?.message || 'Erro ao fazer login');
        },
      },
    );
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(null);
    setResendError(null);
    try {
      await apiClient.post('/auth/resend-confirmation', { email: formData.email });
      setResendSuccess(
        'E-mail de verificação reenviado com sucesso! Verifique sua caixa de entrada.',
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao reenviar e-mail.';
      setResendError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Retorna null se já estiver autenticado (evita render desnecessário)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-arrow/10 dark:bg-brand-leaf/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-arrow/10 dark:bg-brand-leaf/10 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Botão Voltar */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-text/60 hover:text-brand-arrow dark:text-text-dark/60 dark:hover:text-brand-leaf transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Voltar para o início</span>
      </motion.button>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Título */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Logo showSlogan className="mx-auto" />
          </motion.div>

          {/* Card de Login ou Confirmação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm">
              {!needsConfirmation ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                        </div>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-10 bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    {/* Senha */}
                    <div>
                      <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                        Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                        </div>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="pl-10 pr-10 bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-brand-arrow dark:text-brand-leaf hover:opacity-80" />
                          ) : (
                            <Eye className="h-5 w-5 text-brand-arrow dark:text-brand-leaf hover:opacity-80" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lembrar-me e Esqueci a senha */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-border dark:border-border-dark bg-card dark:bg-card-dark text-brand-arrow dark:text-brand-leaf focus:ring-brand-arrow dark:focus:ring-brand-leaf"
                      />
                      <label className="ml-2 block text-sm text-text dark:text-text-dark">
                        Lembrar-me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-brand-arrow hover:text-brand-arrow/80 dark:text-brand-leaf dark:hover:text-brand-leaf/80"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  {/* Feedback de erro */}
                  {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                  {/* Botão de Login */}
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className={cn(
                      'w-full h-11 bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white transition-colors',
                      isLoggingIn && 'opacity-70 cursor-not-allowed',
                    )}
                  >
                    {isLoggingIn ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Entrando...
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="p-6 space-y-6 text-center">
                  <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                    Verifique seu E-mail
                  </h2>
                  <p className="text-sm text-text/80 dark:text-text-dark/80">
                    Sua conta ainda não foi ativada. Enviamos um link de confirmação para{' '}
                    <strong>{formData.email}</strong>.
                  </p>

                  {resendSuccess && (
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md">
                      {resendSuccess}
                    </div>
                  )}
                  {resendError && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
                      {resendError}
                    </div>
                  )}

                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleResendEmail}
                      disabled={isResending}
                      className={cn(
                        'w-full h-11 bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white transition-colors gap-2',
                      )}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Reenviar E-mail
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setNeedsConfirmation(false)}
                      className="w-full h-11"
                    >
                      Voltar para Login
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Links de Ajuda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center space-y-2"
          >
            <div className="mt-8 text-center text-sm text-text/60 dark:text-text-dark/60">
              Não tem conta?{' '}
              <button
                type="button"
                className="text-brand-arrow hover:underline font-medium"
                onClick={() => navigate('/signup')}
              >
                Criar conta
              </button>
            </div>
            <p className="text-xs text-text/60 dark:text-text-dark/60">
              Ao continuar, você concorda com nossos{' '}
              <Link
                to="/terms"
                className="text-brand-arrow hover:text-brand-arrow/80 dark:text-brand-leaf dark:hover:text-brand-leaf/80"
              >
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link
                to="/privacy"
                className="text-brand-arrow hover:text-brand-arrow/80 dark:text-brand-leaf dark:hover:text-brand-leaf/80"
              >
                Política de Privacidade
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Loader2 since it wasn't imported in the original clip
function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
