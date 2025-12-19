import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { useTransactions } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { getAccounts } from '@/services/accountService';
import { getCategories } from '@/services/categoryService';
import { CreateTransactionPayload } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import { Account, Category, TransactionInput, TransactionType } from '@/types/transaction';
import { formatCurrency, formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NewTransaction() {
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

  // Carregamento paralelo de contas e categorias
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([getAccounts(companyId), getCategories(companyId)])
      .then(([accountsData, categoriesData]) => {
        setAccounts(accountsData);
        setCategories(
          categoriesData.map((cat) => ({
            ...cat,
            type: (typeof cat.type === 'string'
              ? cat.type.toUpperCase()
              : cat.type) as TransactionType,
          })),
        );
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : 'Erro ao carregar contas ou categorias.',
        );
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE');
  const [formData, setFormData] = useState<
    TransactionInput & { transactionKind: 'FIXED' | 'VARIABLE'; repeatMonthly: boolean }
  >({
    type: 'EXPENSE',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    note: '',
    dependent: '',
    installmentCount: 1,
    companyId: companyId,
    transactionKind: 'FIXED',
    repeatMonthly: false,
  });
  const { createTransaction, isCreating } = useTransactions(companyId);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validação robusta
  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!formData.description.trim()) errs.description = 'Descrição é obrigatória';
    if (!formData.amount || formData.amount <= 0) errs.amount = 'Valor deve ser maior que zero';
    if (!formData.categoryId) errs.categoryId = 'Categoria é obrigatória';
    if (!formData.accountId) errs.accountId = 'Conta é obrigatória';
    if (!formData.date) errs.date = 'Data é obrigatória';
    if (!companyId) errs.companyId = 'Empresa é obrigatória';
    return errs;
  }, [formData, companyId]);

  // Security: Use sessionStorage instead of localStorage for draft data
  // sessionStorage is cleared when tab closes, reducing exposure
  useEffect(() => {
    try {
      sessionStorage.setItem('transaction_draft', JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save transaction draft:', error);
    }
  }, [formData]);

  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('transaction_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
      }
    } catch (error) {
      console.warn('Failed to load transaction draft:', error);
      // Clear corrupted draft
      sessionStorage.removeItem('transaction_draft');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({ type: 'error', description: 'Por favor, corrija os erros no formulário.' });
      return;
    }
    if (!companyId) {
      toast({ type: 'error', description: 'Nenhuma empresa selecionada.' });
      return;
    }
    const payload: CreateTransactionPayload = {
      description: formData.description,
      launchType: formData.type === 'EXPENSE' ? 'expense' : 'revenue',
      valueType: formData.transactionKind === 'FIXED' ? 'fixed' : 'variable',
      companyId: formData.companyId,
      accountId: formData.accountId,
      categoryId: formData.categoryId,
      value: Number(formData.amount),
      paymentDate: formData.date,
      issueDate: formData.date,
      quantityInstallments: Number(formData.installmentCount),
      repeatMonthly: !!formData.repeatMonthly,
      observation: formData.note,
      reconciled: true,
    };
    try {
      createTransaction(payload, {
        onSuccess: () => {
          toast({ type: 'success', description: 'Transação salva com sucesso!' });
          sessionStorage.removeItem('transaction_draft');
          navigate('/transactions');
        },
        onError: (error) => {
          toast({
            type: 'error',
            description: error instanceof Error ? error.message : 'Erro ao salvar transação.',
          });
        },
      });
    } catch (error) {
      toast({
        type: 'error',
        description: error instanceof Error ? error.message : 'Erro ao salvar transação.',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const formattedValue = formatCurrencyInput(value);
      setFormData((prev) => ({ ...prev, [name]: parseCurrency(formattedValue) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          typeof category.type === 'string' && category.type.toUpperCase() === transactionType,
      )
    : [];

  const selectedAccountName = formData.accountId
    ? (accounts.find((acc) => acc.id === formData.accountId)?.name ?? 'Selecione uma conta')
    : 'Selecione uma conta';

  // Exibir loading enquanto carrega contas ou categorias
  if (loading) {
    return <Loading size="large">Carregando dados...</Loading>;
  }
  if (loadError) {
    return <div className="text-red-500 text-center py-8">{loadError}</div>;
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden bg-background dark:bg-background-dark">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-background/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark">
          <div className="container mx-auto">
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
                <p className="text-sm text-text/60 dark:text-text-dark/60 mb-4">
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

              {/* Description - Linha 1 */}
              <div className="p-4 sm:p-6 bg-background dark:bg-background-dark">
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
                {errors.description && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.description}</span>
                )}
              </div>

              {/* Linha 2: Conta, Categoria, Tipo */}
              <div className="p-4 sm:p-6 bg-background dark:bg-background-dark">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Conta */}
                  <div>
                    <label
                      htmlFor="accountId"
                      className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
                    >
                      Conta
                    </label>
                    <Select
                      value={formData.accountId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, accountId: value }))
                      }
                    >
                      <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors w-full">
                        <div className="px-3 py-2">{selectedAccountName}</div>
                      </SelectTrigger>
                      <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
                        {Array.isArray(accounts) &&
                          accounts.map((account) => (
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
                    {errors.accountId && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.accountId}</span>
                    )}
                  </div>
                  {/* Categoria */}
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
                    >
                      Categoria
                    </label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, categoryId: value }))
                      }
                    >
                      <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors w-full">
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
                    {errors.categoryId && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.categoryId}</span>
                    )}
                  </div>
                  {/* Tipo (toggle) */}
                  <div>
                    <label
                      htmlFor="transactionKind"
                      className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
                    >
                      Tipo
                    </label>
                    <div id="transactionKind" className="flex gap-2">
                      <button
                        type="button"
                        className={cn(
                          'flex-1 px-4 py-2 rounded-lg border font-medium transition-colors',
                          formData.transactionKind === 'FIXED'
                            ? 'bg-card text-primary-500 border-primary-500 shadow'
                            : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-400',
                        )}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, transactionKind: 'FIXED' }))
                        }
                      >
                        Fixa
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'flex-1 px-4 py-2 rounded-lg border font-medium transition-colors',
                          formData.transactionKind === 'VARIABLE'
                            ? 'bg-card text-primary-500 border-primary-500 shadow'
                            : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-400',
                        )}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, transactionKind: 'VARIABLE' }))
                        }
                      >
                        Variável
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha 3: Data, Valor, Parcelas, Repetir mensalmente */}
              <div className="p-4 sm:p-6 bg-background dark:bg-background-dark">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Data */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
                    >
                      Data de pagamento
                    </label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full"
                    />
                    {errors.date && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.date}</span>
                    )}
                  </div>
                  {/* Valor */}
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
                    >
                      Valor
                    </label>
                    <Input
                      id="amount"
                      name="amount"
                      type="text"
                      inputMode="decimal"
                      value={formatCurrency(formData.amount)}
                      onChange={handleChange}
                      placeholder="R$ 0,00"
                      required
                      className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full"
                      autoComplete="off"
                    />
                    {errors.amount && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.amount}</span>
                    )}
                  </div>
                  {/* Parcelas */}
                  <div>
                    <label
                      htmlFor="installmentCount"
                      className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
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
                  {/* Repetir mensalmente */}
                  <div className="flex flex-col justify-center h-full">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.repeatMonthly}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, repeatMonthly: checked }))
                        }
                        id="repeat-monthly"
                      />
                      <label
                        htmlFor="repeat-monthly"
                        className="text-sm text-text dark:text-text-dark select-none cursor-pointer whitespace-nowrap"
                      >
                        Repetir todo mês
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Note */}
              <div className="p-4 sm:p-6 space-y-4 bg-background dark:bg-background-dark">
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
                  disabled={isCreating}
                >
                  {isCreating ? 'Salvando...' : 'Salvar Transação'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
