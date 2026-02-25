import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

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

      const reminder = await prisma.reminders.create({
        data: {
          user_id: userId,
          content,
          trigger_time: new Date(trigger_time),
          frequency: frequency || 'once',
          specific_date: specific_date ? new Date(specific_date) : null,
          weekday,
          status: 'active'
        }
      });

      res.status(201).json({ reminder });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista lembretes do usuário
   */
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { status, frequency } = req.query;
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

      res.json({ reminders });
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

      res.json({ reminder });
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

      const updatedReminder = await prisma.reminders.update({
        where: { id: reminder.id },
        data: {
          content,
          trigger_time: trigger_time ? new Date(trigger_time) : undefined,
          frequency,
          specific_date: specific_date !== undefined ? (specific_date ? new Date(specific_date) : null) : undefined,
          weekday,
          status
        }
      });

      res.json({ reminder: updatedReminder });
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
      const { source_type, limit = 50 } = req.query;
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

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const reminders = await prisma.reminders.findMany({
        where: {
          user_id: userId,
          status: 'active',
          OR: [
            {
              frequency: 'once',
              specific_date: {
                equals: todayDate
              }
            },
            {
              frequency: 'daily'
            },
            {
              frequency: 'weekly',
              weekday: now.toLocaleDateString('en-US', { weekday: 'long' }) as any
            },
            {
              frequency: 'monthly',
              specific_date: {
                not: null
              }
            }
          ]
        },
        orderBy: {
          trigger_time: 'asc'
        }
      });

      const dueReminders = reminders.filter(r => {
        const triggerHour = r.trigger_time.getHours();
        const triggerMinute = r.trigger_time.getMinutes();
        return triggerHour === currentHour && triggerMinute === currentMinute;
      });

      res.json({ dueReminders });
    } catch (error) {
      next(error);
    }
  }
}
