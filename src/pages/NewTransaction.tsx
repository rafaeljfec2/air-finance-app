import { useNavigate } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { getCategoriesByType } from '@/constants/categories';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import {
  BanknotesIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

export function NewTransaction() {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    isSubmitting,
    showSuccessTooltip,
    handleSubmit,
    handleKeyDown,
    formatValue,
    updateFormData,
  } = useTransactionForm();

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="mb-8 w-full max-w-2xl">
          <div className="flex items-center space-x-2">
            <BanknotesIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Novo Lançamento</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-10">
            Preencha os dados abaixo para criar um novo lançamento
          </p>
        </div>

        <div className="relative w-full max-w-2xl">
          {showSuccessTooltip && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg transition-all duration-300">
              <CheckCircleIcon className="h-5 w-5" />
              <span>Transação salva com sucesso!</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            onKeyDown={handleKeyDown}
          >
            {/* Tipo de Transação */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Lançamento
              </label>
              <div className="flex space-x-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="tipo"
                    value="DESPESA"
                    checked={formData.tipo === 'DESPESA'}
                    onChange={e => updateFormData('tipo', e.target.value)}
                  />
                  <div className="flex items-center justify-center space-x-2 p-3 rounded-lg border-2 cursor-pointer peer-checked:border-red-500 peer-checked:text-red-600 dark:peer-checked:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ArrowTrendingDownIcon className="h-5 w-5" />
                    <span>Despesa</span>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="tipo"
                    value="RECEITA"
                    checked={formData.tipo === 'RECEITA'}
                    onChange={e => updateFormData('tipo', e.target.value)}
                  />
                  <div className="flex items-center justify-center space-x-2 p-3 rounded-lg border-2 cursor-pointer peer-checked:border-green-500 peer-checked:text-green-600 dark:peer-checked:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                    <span>Receita</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Descrição */}
            <Input
              id="descricao"
              label="Descrição"
              icon={<PencilSquareIcon className="h-5 w-5 text-gray-400" />}
              value={formData.descricao}
              onChange={e => updateFormData('descricao', e.target.value)}
              error={errors.descricao}
              placeholder="Ex: Compras no supermercado"
              required
            />

            {/* Valor */}
            <Input
              id="valor"
              label="Valor"
              icon={<BanknotesIcon className="h-5 w-5 text-gray-400" />}
              value={formData.valor}
              onChange={e => updateFormData('valor', formatValue(e.target.value))}
              error={errors.valor}
              placeholder="R$ 0,00"
              required
            />

            {/* Categoria */}
            <Select
              id="categoria"
              label="Categoria"
              icon={<TagIcon className="h-5 w-5 text-gray-400" />}
              value={formData.categoria.id}
              onChange={e => {
                const categoria = getCategoriesByType(formData.tipo).find(
                  cat => cat.id === e.target.value
                );
                updateFormData('categoria', categoria || { id: '', nome: '', icone: '', cor: '' });
              }}
              error={errors.categoria}
              options={getCategoriesByType(formData.tipo).map(category => ({
                value: category.id,
                label: `${category.icone} ${category.nome}`,
              }))}
              required
            />

            {/* Data */}
            <Input
              id="data"
              label="Data"
              icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
              type="date"
              value={formData.data}
              onChange={e => updateFormData('data', e.target.value)}
              error={errors.data}
              required
            />

            {/* Observação */}
            <div className="space-y-2">
              <label
                htmlFor="observacao"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <div className="flex items-center space-x-2">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400" />
                  <span>Observação</span>
                </div>
              </label>
              <textarea
                id="observacao"
                rows={3}
                className="block w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                value={formData.observacao}
                onChange={e => updateFormData('observacao', e.target.value)}
                placeholder="Observações adicionais (opcional)"
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 flex items-center space-x-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/statement')}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-500 dark:hover:bg-primary-400 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Salvar (Ctrl + Enter)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ViewDefault>
  );
}
