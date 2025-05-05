import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function NewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isResettingPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const token = searchParams.get('token');
  if (!token) {
    navigate('/login');
    return null;
  }

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      await resetPassword.mutateAsync({
        token: token || '',
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast({
        title: 'Sucesso',
        description: 'Senha alterada com sucesso!',
        type: 'success',
      });
      navigate('/login');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Erro ao alterar senha';
      toast({
        title: 'Erro',
        description: message,
        type: 'error',
      });
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
              <h2 className="text-2xl font-bold text-brand-arrow mb-2">Nova Senha</h2>
              <p className="text-text/60 dark:text-text-dark/60 text-center">
                Digite sua nova senha para continuar
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    disabled={isResettingPassword}
                    className={cn('pl-10 pr-10', errors.password && 'border-red-500')}
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                    ) : (
                      <Eye className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.password}</span>
                )}
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    disabled={isResettingPassword}
                    className={cn('pl-10 pr-10', errors.confirmPassword && 'border-red-500')}
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                    ) : (
                      <Eye className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword}</span>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-3 text-lg mt-2"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? 'Alterando senha...' : 'Alterar Senha'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-text/60 dark:text-text-dark/60">
              Lembrou sua senha?{' '}
              <button
                type="button"
                className="text-brand-arrow hover:underline font-medium"
                onClick={() => navigate('/login')}
              >
                Fazer login
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
