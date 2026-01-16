import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { parseApiError, getUserFriendlyMessage } from '@/utils/apiErrorHandler';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function calculatePasswordStrength(password: string): number {
  let score = 0;
  if (!password) return 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special char

  return score;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'E-mail inválido';
    if (form.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'As senhas não coincidem';
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    register(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
      {
        onSuccess: () => {
          setRegisteredEmail(form.email);
          setSuccess(true);
          // Não navega automaticamente - mostra mensagem de confirmação
        },
        onError: (err: unknown) => {
          const apiError = parseApiError(err);
          const friendlyMessage = getUserFriendlyMessage(apiError);
          setError(friendlyMessage);
        },
      },
    );
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
              <h2 className="text-2xl font-bold text-brand-arrow mb-2">
                {success ? 'Confirme seu Email' : 'Criar Conta'}
              </h2>
              {!success && (
                <p className="text-text/60 dark:text-text-dark/60 text-center">
                  Preencha os campos para começar a usar o Airfinance
                </p>
              )}
            </div>
            {!success && (
              <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={isRegistering}
                    className={`bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={isRegistering}
                    className={`bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    disabled={isRegistering}
                    className={`bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Crie uma senha"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-8 text-gray-400 hover:text-brand-arrow"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 h-1 mb-1">
                        {[1, 2, 3, 4].map((level) => {
                           const strength = calculatePasswordStrength(form.password);
                           let color = 'bg-gray-200 dark:bg-gray-700';
                           if (strength >= level) {
                             if (strength <= 1) color = 'bg-red-500';
                             else if (strength === 2) color = 'bg-yellow-500';
                             else if (strength === 3) color = 'bg-blue-500';
                             else color = 'bg-green-500';
                           }
                           return (
                             <div key={level} className={`flex-1 rounded-full h-full transition-colors duration-300 ${color}`} />
                           );
                        })}
                      </div>
                      <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                        Força: <span className="font-medium">
                          {(() => {
                            const s = calculatePasswordStrength(form.password);
                            if (s <= 1) return 'Fraca';
                            if (s === 2) return 'Média';
                            if (s === 3) return 'Forte';
                            return 'Muito Forte';
                          })()}
                        </span>
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <span className="text-xs text-red-500 mt-1 block">{errors.password}</span>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirmar Senha
                  </label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    disabled={isRegistering}
                    className={`bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Repita a senha"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-8 text-gray-400 hover:text-brand-arrow"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500 mt-1 block">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <Button
                  type="submit"
                  className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-3 text-lg mt-2"
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            )}
            {success && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                      Conta criada com sucesso!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                      Enviamos um link de confirmação para{' '}
                      <strong className="font-medium">{registeredEmail}</strong>. Por favor,
                      verifique sua caixa de entrada e clique no link para confirmar seu endereço de
                      email.
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mb-4">
                      Após confirmar seu email, você poderá fazer login e acessar a plataforma.
                    </p>
                    <Button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Ir para Login
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {!success && (
              <div className="mt-8 text-center text-sm text-text/60 dark:text-text-dark/60">
                Já tem conta?{' '}
                <button
                  type="button"
                  className="text-brand-arrow hover:underline font-medium"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
