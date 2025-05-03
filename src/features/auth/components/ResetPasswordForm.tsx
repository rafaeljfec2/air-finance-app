import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordData, resetPasswordSchema } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../../../components/FormInput';
import { FormButton } from '../../../components/FormButton';
import { Alert } from '../../../components/Alert';
import { useParams } from 'react-router-dom';

export function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>();
  const { resetPassword, isResettingPassword, resetPasswordError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordData) => {
    if (!token) {
      return;
    }
    resetPassword(data, token);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {resetPasswordError && <Alert type="error" message={resetPasswordError.message} />}

      <FormInput
        label="Nova Senha"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <FormInput
        label="Confirmar Nova Senha"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <FormButton
        type="submit"
        isLoading={isResettingPassword}
        disabled={isResettingPassword || !token}
      >
        Resetar Senha
      </FormButton>
    </form>
  );
}
