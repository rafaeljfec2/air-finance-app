import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transaction';
import { TransactionInput, Category, TransactionType } from '@/types/transaction';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft } from 'lucide-react';
import { dependents } from '@/constants/dependents';
import { useCompanyContext } from '@/contexts/companyContext';

export function NewTransaction() {
  const navigate = useNavigate();
  const { addTransaction, categories, accounts } = useTransactionStore();
  const { companyId } = useCompanyContext() as { companyId: string };
  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE');
  const [formData, setFormData] = useState<TransactionInput>({
    type: 'EXPENSE',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    note: '',
    dependent: '',
    installmentCount: 1,
    companyId: companyId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      alert('Nenhuma empresa selecionada.');
      return;
    }
    addTransaction(formData, companyId);
    navigate('/transactions');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const filteredCategories = categories.filter(
    (category: Category) => category.type === transactionType,
  );

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-background/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/transactions')}
                className="p-2 -ml-2 hover:bg-card dark:hover:bg-card-dark rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
              </button>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-text dark:text-text-dark">
                  Nova Transação
                </h1>
                <p className="text-sm text-text/60 dark:text-text-dark/60">
                  Preencha os dados da transação
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card className="bg-card dark:bg-card-dark border border-border dark:border-border-dark w-full sm:max-w-[60%] sm:mx-auto shadow-lg">
            <form
              id="transaction-form"
              onSubmit={handleSubmit}
              className="divide-y divide-border dark:divide-border-dark"
            >
              {/* Transaction Type */}
              <div className="p-4 sm:p-6 bg-background dark:bg-background-dark rounded-t-lg">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('EXPENSE');
                      setFormData((prev) => ({ ...prev, type: 'EXPENSE' }));
                    }}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-center gap-2 transition-all font-medium',
                      transactionType === 'EXPENSE'
                        ? 'bg-red-600 border-red-600 text-white dark:bg-red-500 dark:border-red-500 dark:text-white shadow-md'
                        : 'border-border dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark hover:border-primary-500 dark:hover:border-primary-400',
                    )}
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                    <span className="text-sm">Despesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('INCOME');
                      setFormData((prev) => ({ ...prev, type: 'INCOME' }));
                    }}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-center gap-2 transition-all font-medium',
                      transactionType === 'INCOME'
                        ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-white shadow-md'
                        : 'border-border dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark hover:border-primary-500 dark:hover:border-primary-400',
                    )}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                    <span className="text-sm">Receita</span>
                  </button>
                </div>
              </div>

              {/* Description and Amount */}
              <div className="p-4 sm:p-6 space-y-4 bg-background dark:bg-background-dark">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Descrição
                  </label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ex: Supermercado, Salário, etc."
                    required
                    className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Valor
                  </label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    placeholder="0,00"
                    required
                    className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Category and Account */}
              <div className="p-4 sm:p-6 space-y-4 bg-background dark:bg-background-dark">
                <div>
                  <label
                    htmlFor="accountId"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Conta
                  </label>
                  <Select
                    id="accountId"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma conta</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Categoria
                  </label>
                  <Select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="dependent"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Dependente
                  </label>
                  <Select
                    id="dependent"
                    name="dependent"
                    value={formData.dependent}
                    onChange={handleChange}
                    className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                  >
                    <option value="">Selecione um dependente (opcional)</option>
                    {dependents.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="installmentCount"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Quantidade de parcelas
                  </label>
                  <Select
                    id="installmentCount"
                    name="installmentCount"
                    value={formData.installmentCount}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}x
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Date and Note */}
              <div className="p-4 sm:p-6 space-y-4 bg-background dark:bg-background-dark">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Data
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1"
                  >
                    Observação
                  </label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Adicione uma observação (opcional)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-4 sm:p-6 bg-background dark:bg-background-dark rounded-b-lg">
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-400 transition-colors shadow-md"
                >
                  Salvar Transação
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
