import { api } from './api';

export interface InstallmentTransaction {
  id: number;
  installment_number: number;
  amount: number;
  transaction_date: Date;
  status: string;
  description: string;
}

export interface InstallmentPurchase {
  id: number;
  description: string;
  amount: number;
  installment_count: number;
  installment_value: number;
  first_installment: number;
  start_date: Date;
  status: string;
  card: {
    id: number;
    name: string;
  };
  paid_installments: number;
  remaining_installments: number;
  transactions: InstallmentTransaction[];
}

export interface CreateInstallmentDTO {
  entity_id: number;
  description: string;
  amount: number;
  installment_count: number;
  start_date: string;
  category?: string;
  category_id?: number;
}

class InstallmentsService {
  async create(data: CreateInstallmentDTO) {
    const response = await api.post('/installments', data);
    return response.data;
  }

  async list(entity_id?: number, status?: string) {
    const params = new URLSearchParams();
    if (entity_id) params.append('entity_id', entity_id.toString());
    if (status) params.append('status', status);

    const response = await api.get(`/installments?${params.toString()}`);
    return response.data.purchases as InstallmentPurchase[];
  }

  async getById(id: number) {
    const response = await api.get(`/installments/${id}`);
    return response.data.purchase as InstallmentPurchase;
  }

  async cancel(id: number) {
    const response = await api.delete(`/installments/${id}`);
    return response.data;
  }

  async updateStatus(id: number, status: 'active' | 'completed' | 'cancelled') {
    const response = await api.put(`/installments/${id}/status`, { status });
    return response.data.purchase;
  }
}

export const installmentsService = new InstallmentsService();
