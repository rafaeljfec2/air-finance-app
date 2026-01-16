import { apiClient } from './apiClient';

export interface CreateTicketDTO {
  subject: string;
  category: 'bug' | 'feature' | 'question' | 'billing' | 'other';
  message: string;
  priority?: 'normal' | 'urgent';
  // attachment?: File; // Phase 2
}

export const supportService = {
  createTicket: async (data: CreateTicketDTO) => {
    const response = await apiClient.post('/support/tickets', data);
    return response.data;
  },

  getMyTickets: async () => {
    const response = await apiClient.get('/support/tickets');
    return response.data;
  },
};
