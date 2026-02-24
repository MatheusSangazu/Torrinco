import { api } from './api';

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';
export type ReminderStatus = 'active' | 'completed';
export type ReminderWeekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Reminder {
  id: number;
  user_id: number;
  content: string;
  trigger_time: string;
  frequency: ReminderFrequency;
  specific_date?: string | null;
  weekday?: ReminderWeekday | null;
  status: ReminderStatus;
  created_at: string;
}

export interface CreateReminderDTO {
  content: string;
  trigger_time: string;
  frequency?: ReminderFrequency;
  specific_date?: string;
  weekday?: ReminderWeekday;
}

export interface UpdateReminderDTO {
  content?: string;
  trigger_time?: string;
  frequency?: ReminderFrequency;
  specific_date?: string;
  weekday?: ReminderWeekday;
  status?: ReminderStatus;
}

export const remindersService = {
  list: async (params?: { status?: ReminderStatus; frequency?: ReminderFrequency }): Promise<Reminder[]> => {
    const response = await api.get('/reminders', { params });
    return response.data.reminders;
  },

  getById: async (id: number): Promise<Reminder> => {
    const response = await api.get(`/reminders/${id}`);
    return response.data.reminder;
  },

  create: async (data: CreateReminderDTO): Promise<Reminder> => {
    const response = await api.post('/reminders', data);
    return response.data.reminder;
  },

  update: async (id: number, data: UpdateReminderDTO): Promise<Reminder> => {
    const response = await api.put(`/reminders/${id}`, data);
    return response.data.reminder;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  },

  listDue: async (): Promise<Reminder[]> => {
    const response = await api.get('/reminders/due');
    return response.data.dueReminders;
  },

  markAsCompleted: async (id: number): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  }
};
