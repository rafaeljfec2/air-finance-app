import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

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

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) newErrors.email = 'E-mail inválido';
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
          setSuccess(true);
          setTimeout(() => navigate('/login'), 1500);
        },
        onError: (err: any) => {
          setError(err?.message || 'Erro ao criar conta');
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
              <h2 className="text-2xl font-bold text-brand-arrow mb-2">Criar Conta</h2>
              <p className="text-text/60 dark:text-text-dark/60 text-center">
                Preencha os campos para começar a usar o Airfinance
              </p>
            </div>
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
                  className={errors.name ? 'border-red-500' : ''}
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
                  className={errors.email ? 'border-red-500' : ''}
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
                  className={errors.password ? 'border-red-500' : ''}
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
                  className={errors.confirmPassword ? 'border-red-500' : ''}
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
                  <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword}</span>
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
              {success && (
                <div className="flex items-center gap-2 text-green-600 mt-2 justify-center">
                  <CheckCircle2 className="w-5 h-5" /> Conta criada com sucesso!
                </div>
              )}
            </form>
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
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
