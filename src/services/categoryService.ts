import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo de categoria inválido' }),
  }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  userId: z.string(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;

// Service functions
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>('/categories');
    return CategorySchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw new Error('Falha ao buscar categorias');
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return CategorySchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    throw new Error('Falha ao buscar categoria');
  }
};

export const createCategory = async (data: CreateCategory): Promise<Category> => {
  try {
    const validatedData = CreateCategorySchema.parse(data);
    const response = await apiClient.post<Category>('/categories', validatedData);
    return CategorySchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw new Error('Falha ao criar categoria');
  }
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategory>,
): Promise<Category> => {
  try {
    const validatedData = CreateCategorySchema.partial().parse(data);
    const response = await apiClient.put<Category>(`/categories/${id}`, validatedData);
    return CategorySchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw new Error('Falha ao atualizar categoria');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw new Error('Falha ao deletar categoria');
  }
};
