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
  status: 'open' | 'closed' | 'paid';
  isPaid?: boolean;
  paymentId?: number;
  billId?: number;
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

export interface PayBillDTO {
  payment_method?: string;
  payment_date?: string;
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

  // --- Faturas (via billing.service no backend) ---

  getBill: async (cardId: number) => {
    const response = await api.get(`/cards/${cardId}/bill`);
    return response.data;
  },

  getNextBill: async (cardId: number) => {
    const response = await api.get(`/finance/cards/${cardId}/next-bill`);
    return response.data;
  },

  getPreviousBill: async (cardId: number) => {
    const response = await api.get(`/finance/cards/${cardId}/previous-bill`);
    return response.data;
  },

  /** Histórico de faturas (formato novo: period_start, total_amount, status, bill_id...). */
  getBillHistory: async (cardId: number, months: number = 6) => {
    const response = await api.get(`/cards/${cardId}/bills?months=${months}`);
    return response.data.bills;
  },

  /** Detalhe de uma fatura por id (via billing.service). */
  getBillDetails: async (cardId: number, billId: number) => {
    const response = await api.get(`/cards/${cardId}/bills/${billId}`);
    return response.data;
  },

  /** Registra pagamento de uma fatura (cria transação vinculada por FK no backend). */
  payBill: async (cardId: number, billId: number, data?: PayBillDTO) => {
    const response = await api.post(`/cards/${cardId}/bills/${billId}/pay`, data ?? {});
    return response.data.bill;
  },

  /** Desfaz o pagamento de uma fatura (via FK no backend, não string matching). */
  undoBillPayment: async (cardId: number, billId: number) => {
    const response = await api.post(`/cards/${cardId}/bills/${billId}/undo`);
    return response.data.bill;
  }
};
