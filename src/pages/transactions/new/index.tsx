import { useNavigate } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransactionStore } from '@/stores/transaction';
import { TransactionType } from '@/types/transaction';

const transactionSchema = z.object({
  tipo: z.enum(['RECEITA', 'DESPESA']),
  descricao: z.string().min(3, 'A descrição deve ter no mínimo 3 caracteres'),
  valor: z.number().min(0.01, 'O valor deve ser maior que zero'),
  data: z.string(),
  categoriaId: z.string().min(1, 'Selecione uma categoria'),
  contaId: z.string().min(1, 'Selecione uma conta'),
  observacao: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function NewTransaction() {
  const navigate = useNavigate();
  const { categories, accounts, addTransaction } = useTransactionStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      tipo: 'DESPESA',
      data: new Date().toISOString().split('T')[0],
    },
  });

  const transactionType = watch('tipo');

  const filteredCategories = categories.filter(
    category => category.tipo === transactionType
  );

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await addTransaction({
        ...data,
        valor: Number(data.valor),
      });
      
      navigate('/transactions');
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Nova Transação
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de Transação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Transação
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="RECEITA"
                    {...register('tipo')}
                    className="form-radio text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Receita</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="DESPESA"
                    {...register('tipo')}
                    className="form-radio text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Despesa</span>
                </label>
              </div>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <input
                type="text"
                id="descricao"
                {...register('descricao')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
              )}
            </div>

            {/* Valor */}
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  id="valor"
                  step="0.01"
                  {...register('valor', { valueAsNumber: true })}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              {errors.valor && (
                <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>
              )}
            </div>

            {/* Data */}
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data
              </label>
              <input
                type="date"
                id="data"
                {...register('data')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
              {errors.data && (
                <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                id="categoriaId"
                {...register('categoriaId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              >
                <option value="">Selecione uma categoria</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoriaId.message}</p>
              )}
            </div>

            {/* Conta */}
            <div>
              <label htmlFor="contaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conta
              </label>
              <select
                id="contaId"
                {...register('contaId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              >
                <option value="">Selecione uma conta</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.nome}
                  </option>
                ))}
              </select>
              {errors.contaId && (
                <p className="mt-1 text-sm text-red-600">{errors.contaId.message}</p>
              )}
            </div>

            {/* Observação */}
            <div>
              <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observação
              </label>
              <textarea
                id="observacao"
                rows={3}
                {...register('observacao')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
              {errors.observacao && (
                <p className="mt-1 text-sm text-red-600">{errors.observacao.message}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ViewDefault>
  );
} 