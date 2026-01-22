import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../hooks/useLoginForm';

interface LoginFormProps {
  formData: LoginFormData;
  error: string | null;
  isLoggingIn: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  formData,
  error,
  isLoggingIn,
  showPassword,
  onTogglePassword,
  onChange,
  onSubmit,
}: Readonly<LoginFormProps>) {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
            </div>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              className="pl-10 bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        {/* Senha */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
          >
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-brand-arrow dark:text-brand-leaf" />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              className="pl-10 pr-10 bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={onTogglePassword}
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
            id="rememberMe"
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={onChange}
            className="h-4 w-4 rounded border-border dark:border-border-dark bg-card dark:bg-card-dark text-brand-arrow dark:text-brand-leaf focus:ring-brand-arrow dark:focus:ring-brand-leaf"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-text dark:text-text-dark">
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
  );
}
