import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../../store/auth';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      // TODO: Implementar chamada real à API
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      login(
        {
          id: '1',
          nome: 'Usuário Teste',
          email: data.email,
        },
        'fake-token'
      );
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="input mt-1"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label
          htmlFor="senha"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          className="input mt-1"
          {...register('senha')}
        />
        {errors.senha && <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>}
      </div>

      <div>
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </form>
  );
}
