import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterData, registerSchema } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../../../components/FormInput';
import { FormButton } from '../../../components/FormButton';
import { Alert } from '../../../components/Alert';

export function RegisterForm() {
  const { register, isRegistering, registerError } = useAuth();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    register(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {registerError && <Alert type="error" message={registerError.message} />}

      <FormInput label="Nome" type="text" error={errors.name?.message} {...registerForm('name')} />

      <FormInput
        label="Email"
        type="email"
        error={errors.email?.message}
        {...registerForm('email')}
      />

      <FormInput
        label="Senha"
        type="password"
        error={errors.password?.message}
        {...registerForm('password')}
      />

      <FormInput
        label="Confirmar Senha"
        type="password"
        error={errors.confirmPassword?.message}
        {...registerForm('confirmPassword')}
      />

      <FormButton type="submit" isLoading={isRegistering} disabled={isRegistering}>
        Registrar
      </FormButton>
    </form>
  );
}
