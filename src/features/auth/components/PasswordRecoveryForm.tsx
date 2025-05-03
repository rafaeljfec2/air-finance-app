import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordRecoveryData, passwordRecoverySchema } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../../../components/FormInput';
import { FormButton } from '../../../components/FormButton';
import { Alert } from '../../../components/Alert';

export function PasswordRecoveryForm() {
  const { requestPasswordRecovery, isRequestingPasswordRecovery, passwordRecoveryError } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoveryData>({
    resolver: zodResolver(passwordRecoverySchema),
  });

  const onSubmit = (data: PasswordRecoveryData) => {
    requestPasswordRecovery(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {passwordRecoveryError && <Alert type="error" message={passwordRecoveryError.message} />}

      <FormInput label="Email" type="email" error={errors.email?.message} {...register('email')} />

      <FormButton
        type="submit"
        isLoading={isRequestingPasswordRecovery}
        disabled={isRequestingPasswordRecovery}
      >
        Recuperar Senha
      </FormButton>
    </form>
  );
}
