import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginData, loginSchema } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../../../components/FormInput';
import { FormButton } from '../../../components/FormButton';
import { Alert } from '../../../components/Alert';

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && <Alert type="error" message={loginError.message} />}

      <FormInput label="Email" type="email" error={errors.email?.message} {...register('email')} />

      <FormInput
        label="Senha"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <FormButton type="submit" isLoading={isLoggingIn} disabled={isLoggingIn}>
        Entrar
      </FormButton>
    </form>
  );
}
