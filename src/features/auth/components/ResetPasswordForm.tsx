import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { Alert } from '@/components/Alert';
import { useAuth } from '../hooks/useAuth';
import { ResetPasswordData } from '../types/auth.types';

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, isResettingPassword, resetPasswordError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!token) {
      setError('Token inválido');
      return;
    }

    try {
      const data: ResetPasswordData = { password, confirmPassword };
      await resetPassword(data, token);
      navigate('/login?reset=success');
    } catch (err) {
      setError('Erro ao redefinir senha. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {resetPasswordError && <Alert type="error" message={resetPasswordError.message} />}

      <FormInput
        label="Nova Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Digite sua nova senha"
      />

      <FormInput
        label="Confirmar Nova Senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder="Confirme sua nova senha"
      />

      <FormButton
        type="submit"
        isLoading={isResettingPassword}
        disabled={isResettingPassword}
        fullWidth
      >
        Redefinir Senha
      </FormButton>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          Voltar para o login
        </button>
      </div>
    </form>
  );
};
