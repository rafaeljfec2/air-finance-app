import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NewTransaction } from '../NewTransaction';
import { useTransactionForm } from '@/hooks/useTransactionForm';

// Mock do hook useTransactionForm
jest.mock('@/hooks/useTransactionForm', () => ({
  useTransactionForm: jest.fn(),
}));

describe('NewTransaction', () => {
  const mockHandleSubmit = jest.fn();
  const mockHandleKeyDown = jest.fn();
  const mockUpdateFormData = jest.fn();
  const mockFormatValue = jest.fn();

  beforeEach(() => {
    (useTransactionForm as jest.Mock).mockReturnValue({
      formData: {
        descricao: '',
        valor: '',
        tipo: 'DESPESA',
        categoria: {
          id: '',
          nome: '',
          icone: '',
          cor: '',
        },
        data: '2024-01-01',
        observacao: '',
      },
      errors: {},
      isSubmitting: false,
      showSuccessTooltip: false,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
      formatValue: mockFormatValue,
      updateFormData: mockUpdateFormData,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário corretamente', () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>
    );

    expect(screen.getByText('Novo Lançamento')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Lançamento')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Observação')).toBeInTheDocument();
  });

  it('deve chamar updateFormData ao alterar campos', () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>
    );

    const descricaoInput = screen.getByPlaceholderText('Ex: Compras no supermercado');
    fireEvent.change(descricaoInput, { target: { value: 'Teste' } });
    expect(mockUpdateFormData).toHaveBeenCalledWith('descricao', 'Teste');

    const valorInput = screen.getByPlaceholderText('R$ 0,00');
    fireEvent.change(valorInput, { target: { value: '100' } });
    expect(mockFormatValue).toHaveBeenCalledWith('100');

    const observacaoInput = screen.getByPlaceholderText('Observações adicionais (opcional)');
    fireEvent.change(observacaoInput, { target: { value: 'Teste observação' } });
    expect(mockUpdateFormData).toHaveBeenCalledWith('observacao', 'Teste observação');
  });

  it('deve chamar handleSubmit ao submeter o formulário', () => {
    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('deve mostrar mensagem de sucesso', async () => {
    (useTransactionForm as jest.Mock).mockReturnValue({
      formData: {
        descricao: '',
        valor: '',
        tipo: 'DESPESA',
        categoria: {
          id: '',
          nome: '',
          icone: '',
          cor: '',
        },
        data: '2024-01-01',
        observacao: '',
      },
      errors: {},
      isSubmitting: false,
      showSuccessTooltip: true,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
      formatValue: mockFormatValue,
      updateFormData: mockUpdateFormData,
    });

    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Transação salva com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve mostrar mensagens de erro', () => {
    (useTransactionForm as jest.Mock).mockReturnValue({
      formData: {
        descricao: '',
        valor: '',
        tipo: 'DESPESA',
        categoria: {
          id: '',
          nome: '',
          icone: '',
          cor: '',
        },
        data: '2024-01-01',
        observacao: '',
      },
      errors: {
        descricao: 'Descrição é obrigatória',
        valor: 'Valor deve ser maior que zero',
        categoria: 'Categoria é obrigatória',
      },
      isSubmitting: false,
      showSuccessTooltip: false,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
      formatValue: mockFormatValue,
      updateFormData: mockUpdateFormData,
    });

    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>
    );

    expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Valor deve ser maior que zero')).toBeInTheDocument();
    expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument();
  });

  it('deve mostrar estado de loading durante submissão', () => {
    (useTransactionForm as jest.Mock).mockReturnValue({
      formData: {
        descricao: '',
        valor: '',
        tipo: 'DESPESA',
        categoria: {
          id: '',
          nome: '',
          icone: '',
          cor: '',
        },
        data: '2024-01-01',
        observacao: '',
      },
      errors: {},
      isSubmitting: true,
      showSuccessTooltip: false,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
      formatValue: mockFormatValue,
      updateFormData: mockUpdateFormData,
    });

    render(
      <BrowserRouter>
        <NewTransaction />
      </BrowserRouter>
    );

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });
});
