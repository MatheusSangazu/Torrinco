import { api } from './api';

export interface CreditCard {
  id: number;
  name: string;
  type: 'bank' | 'credit_card';
  limit: number;
  currentBill: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  closingDate: Date;
  dueDate: Date;
  status: 'open' | 'closed';
  transactionCount: number;
  color: string;
}

export interface CreateCardDTO {
  name: string;
  limit?: number;
  closing_day?: number;
  due_day?: number;
  color?: string;
}

export interface UpdateCardDTO {
  name?: string;
  limit?: number;
  closing_day?: number;
  due_day?: number;
  color?: string;
}

export const cardsService = {
  list: async (): Promise<CreditCard[]> => {
    const response = await api.get('/cards');
    return response.data.cards;
  },

  create: async (data: CreateCardDTO): Promise<CreditCard> => {
    const response = await api.post('/cards', data);
    return response.data.card;
  },

  update: async (id: number, data: UpdateCardDTO): Promise<CreditCard> => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data.card;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/cards/${id}`);
  },

  getBill: async (cardId: number) => {
    const response = await api.get(`/finance/cards/${cardId}/bill`);
    return response.data;
  },

  getNextBill: async (cardId: number) => {
    const response = await api.get(`/finance/cards/${cardId}/next-bill`);
    return response.data;
  }
};
