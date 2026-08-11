import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { getValidatedQuery } from '../middleware/validate.js';
import { formatDatabaseDate, formatDatabaseTime, isReminderDue, parseLocalDate, parseLocalTime } from '../lib/reminder-time.js';

function serializeReminder<T extends { trigger_time: Date; specific_date: Date | null }>(reminder: T) {
  return { ...reminder, trigger_time: formatDatabaseTime(reminder.trigger_time), specific_date: formatDatabaseDate(reminder.specific_date) };
}

function scheduleError(frequency: string, specificDate?: string | null, weekday?: string | null): string | null {
  if ((frequency === 'once' || frequency === 'monthly') && !specificDate) return 'specific_date is required for once and monthly reminders';
  if (frequency === 'weekly' && !weekday) return 'weekday is required for weekly reminders';
  return null;
}

export class ReminderController {
  /**
   * Cria um novo lembrete
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { content, trigger_time, frequency, specific_date, weekday } = req.body;
      const userId = req.userId!;

      if (!content || !trigger_time) {
        return res.status(400).json({ error: 'Content and trigger_time are required' });
      }
      const normalizedFrequency = frequency || 'once';
      const invalidSchedule = scheduleError(normalizedFrequency, specific_date, weekday);
      if (invalidSchedule) return res.status(400).json({ error: invalidSchedule });

      const reminder = await prisma.reminders.create({
        data: {
          user_id: userId,
          content,
          trigger_time: parseLocalTime(trigger_time),
          frequency: normalizedFrequency,
          specific_date: specific_date ? parseLocalDate(specific_date) : null,
          weekday: normalizedFrequency === 'weekly' ? weekday : null,
          status: 'active'
        }
      });

      res.status(201).json({ reminder: serializeReminder(reminder) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista lembretes do usuário
   */
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { status, frequency } = getValidatedQuery(req);
      const userId = req.userId!;

      const where: any = { user_id: userId };
      if (status) where.status = status;
      if (frequency) where.frequency = frequency;

      const reminders = await prisma.reminders.findMany({
        where,
        orderBy: {
          trigger_time: 'asc'
        }
      });

      res.json({ reminders: reminders.map(serializeReminder) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém um lembrete por ID
   */
  static async getById(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const reminder = await prisma.reminders.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        }
      });

      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      res.json({ reminder: serializeReminder(reminder) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um lembrete
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content, trigger_time, frequency, specific_date, weekday, status } = req.body;
      const userId = req.userId!;

      const reminder = await prisma.reminders.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        }
      });

      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }
      const normalizedFrequency = frequency ?? reminder.frequency ?? 'once';
      const normalizedSpecificDate = specific_date === undefined ? formatDatabaseDate(reminder.specific_date) : specific_date;
      const normalizedWeekday = weekday === undefined ? reminder.weekday : weekday;
      const invalidSchedule = scheduleError(normalizedFrequency, normalizedSpecificDate, normalizedWeekday);
      if (invalidSchedule) return res.status(400).json({ error: invalidSchedule });

      const updatedReminder = await prisma.reminders.update({
        where: { id: reminder.id },
        data: {
          content,
          trigger_time: trigger_time ? parseLocalTime(trigger_time) : undefined,
          frequency,
          specific_date: specific_date !== undefined
            ? (specific_date ? parseLocalDate(specific_date) : null)
            : (frequency && (normalizedFrequency === 'daily' || normalizedFrequency === 'weekly') ? null : undefined),
          weekday: normalizedFrequency === 'weekly' ? normalizedWeekday : null,
          status
        }
      });

      res.json({ reminder: serializeReminder(updatedReminder) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marca um lembrete como concluído
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const reminder = await prisma.reminders.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        }
      });

      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      await prisma.reminders.update({
        where: { id: reminder.id },
        data: { status: 'completed' }
      });

      res.json({ message: 'Reminder marked as completed' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um log de lembrete
   */
  static async createLog(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { event_identifier, source_type, reminder_type, reminder_type_new } = req.body;
      const userId = req.userId!;

      if (!event_identifier || !source_type) {
        return res.status(400).json({ error: 'Event identifier and source type are required' });
      }

      const reminderLog = await prisma.reminder_logs.create({
        data: {
          user_id: userId,
          event_identifier,
          source_type,
          reminder_type: reminder_type || 'h',
          reminder_type_new: reminder_type_new || 'h'
        }
      });

      res.status(201).json({ reminderLog });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista logs de lembretes
   */
  static async listLogs(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { source_type, limit = 50 } = getValidatedQuery(req);
      const userId = req.userId!;

      const where: any = { user_id: userId };
      if (source_type) where.source_type = source_type;

      const logs = await prisma.reminder_logs.findMany({
        where,
        orderBy: {
          sent_at: 'desc'
        },
        take: Number(limit)
      });

      res.json({ logs });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista lembretes vencidos ou para o momento atual
   */
  static async listDue(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      // Mantém o parâmetro normalizado disponível para evolução do horizonte
      // sem ler novamente o getter req.query do Express 5.
      getValidatedQuery<{ days?: number }>(req);

      const now = new Date();

      const reminders = await prisma.reminders.findMany({
        where: {
          user_id: userId,
          status: 'active'
        },
        orderBy: {
          trigger_time: 'asc'
        }
      });

      const dueReminders = reminders.filter(reminder => isReminderDue(reminder, now));

      res.json({ dueReminders: dueReminders.map(serializeReminder) });
    } catch (error) {
      next(error);
    }
  }
}
