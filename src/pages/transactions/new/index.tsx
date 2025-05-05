import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transaction';
import { TransactionInput, Category, TransactionType } from '@/types/transaction';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
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
                  Novo lançamento
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
                    value={formData.accountId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, accountId: value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                      <div className="px-3 py-2">
                        {formData.accountId
                          ? accounts.find((acc) => acc.id === formData.accountId)?.name
                          : 'Selecione uma conta'}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id}
                          className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                        >
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                      <div className="px-3 py-2">
                        {formData.categoryId
                          ? filteredCategories.find((cat) => cat.id === formData.categoryId)?.name
                          : 'Selecione uma categoria'}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                      {filteredCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
                    value={formData.dependent || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, dependent: value === 'none' ? '' : value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                      <div className="px-3 py-2">
                        {formData.dependent
                          ? dependents.find((dep) => dep.id === formData.dependent)?.name
                          : 'Selecione um dependente (opcional)'}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                      <SelectItem
                        value="none"
                        className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                      >
                        Nenhum
                      </SelectItem>
                      {dependents.map((dep) => (
                        <SelectItem
                          key={dep.id}
                          value={dep.id}
                          className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                        >
                          {dep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
                    value={String(formData.installmentCount)}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, installmentCount: Number(value) }))
                    }
                  >
                    <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                      <div className="px-3 py-2">{formData.installmentCount}x</div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem
                          key={num}
                          value={String(num)}
                          className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                        >
                          {num}x
                        </SelectItem>
                      ))}
                    </SelectContent>
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
