import { apiClient } from './apiClient';

export interface OpenAILog {
  _id: string;
  promptOrDescription: string;
  response?: string;
  aiModel: string;
  status: 'success' | 'error';
  metadata?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
}

export const openaiService = {
  getLogs: async (): Promise<OpenAILog[]> => {
    try {
      const response = await apiClient.get<OpenAILog[]>('/openai/logs');
      return response.data;
    } catch (error) {
      console.error('Error fetching OpenAI logs:', error);
      throw error;
    }
  },
};
