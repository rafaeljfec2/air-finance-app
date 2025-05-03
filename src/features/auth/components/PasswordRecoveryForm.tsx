import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { Alert } from '@/components/Alert';
import { useAuth } from '../hooks/useAuth';
import { PasswordRecoveryData } from '../types/auth.types';

export const PasswordRecoveryForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { requestPasswordRecovery, isRequestingPasswordRecovery, passwordRecoveryError } =
    useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data: PasswordRecoveryData = { email };
      await requestPasswordRecovery(data);
      navigate('/login?recovery=success');
    } catch (err) {
      setError('Erro ao solicitar recuperação de senha. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {passwordRecoveryError && <Alert type="error" message={passwordRecoveryError.message} />}

      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Digite seu email"
      />

      <FormButton
        type="submit"
        isLoading={isRequestingPasswordRecovery}
        disabled={isRequestingPasswordRecovery}
        fullWidth
      >
        Solicitar Recuperação
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
