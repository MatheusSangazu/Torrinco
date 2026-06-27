import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { parseDate, advanceDate, todayUTC, type Frequency } from '../lib/date-utils.js';
import * as recurringService from '../services/recurring.service.js';

export class RecurringController {
  /**
   * Cria uma nova transação recorrente
   */
  static async createTransaction(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { description, amount, category, category_id, type, frequency, start_date, entity_id, payment_method } = req.body;
      const userId = req.userId!;

      if (!description || !amount || !type || !frequency || !start_date) {
        return res.status(400).json({
          error: 'Description, amount, type, frequency and start_date are required'
        });
      }

      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Type must be income or expense' });
      }

      const recurringTransaction = await recurringService.createRecurring(userId, {
        description,
        amount: parseFloat(amount),
        type,
        frequency,
        start_date,
        category,
        category_id: category_id ? Number(category_id) : undefined,
        entity_id: entity_id ? Number(entity_id) : undefined,
        payment_method
      });

      res.status(201).json({ recurringTransaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista transações recorrentes
   */
  static async listTransactions(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { status, type } = req.query;
      const userId = req.userId!;

      const where: any = { user_id: userId };
      if (status) where.status = status;
      if (type) where.type = type;

      const recurringTransactions = await prisma.recurring_transactions.findMany({
        where,
        orderBy: {
          next_due_date: 'asc'
        }
      });

      res.json({ recurringTransactions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza uma transação recorrente
   */
  static async updateTransaction(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { description, amount, category, category_id, frequency, status, entity_id, payment_method } = req.body;
      const userId = req.userId!;

      const existing = await prisma.recurring_transactions.findFirst({
        where: { id: Number(id), user_id: userId }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Recurring transaction not found' });
      }

      // Resolver category_id e category name se necessário
      let finalCategoryId = category_id !== undefined ? (category_id ? parseInt(category_id) : null) : undefined;
      let finalCategoryName = category;

      if (finalCategoryId && !finalCategoryName) {
        const cat = await prisma.categories.findUnique({ where: { id: finalCategoryId } });
        if (cat) finalCategoryName = cat.name;
      }

      // Mapear status 'pending' para 'active' se vier do frontend (visto que recorrência é sempre active/inactive)
      let finalStatus = status;
      if (status === 'pending' || status === 'paid') {
        finalStatus = 'active';
      }

      const updated = await prisma.recurring_transactions.update({
        where: { id: Number(id) },
        data: {
          description: description ?? undefined,
          amount: amount ? parseFloat(amount) : undefined,
          category: finalCategoryName ?? undefined,
          frequency: frequency ?? undefined,
          status: (finalStatus as any) ?? undefined,
          entity_id: entity_id !== undefined ? (entity_id ? parseInt(entity_id) : null) : undefined,
          payment_method: payment_method ?? undefined
        }
      });

      res.json({ recurringTransaction: updated });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove (cancela) uma transação recorrente
   */
  static async deleteTransaction(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const existing = await prisma.recurring_transactions.findFirst({
        where: { id: Number(id), user_id: userId }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Recurring transaction not found' });
      }

      await prisma.recurring_transactions.update({
        where: { id: Number(id) },
        data: { status: 'cancelled' }
      });

      res.json({ message: 'Recurring transaction cancelled successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gera uma transação real a partir de uma recorrente (delega ao service).
   */
  static async generateTransaction(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { transaction_date } = req.body;
      const userId = req.userId!;
      const date = transaction_date ? parseDate(transaction_date) : undefined;
      const transaction = await recurringService.materializeOne(userId, Number(id), date);
      res.status(201).json({ transaction });
    } catch (error: any) {
      res.status(error?.message === 'RECURRING_NOT_FOUND' ? 404 : 400).json({ error: error?.message });
    }
  }

  /**
   * Lista transações recorrentes próximas do vencimento (delega ao service).
   */
  static async listDue(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { days = 7 } = req.query;
      const userId = req.userId!;
      const dueTransactions = await recurringService.listDueSoon(userId, Number(days));
      res.json({ dueTransactions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gatilho manual para materializar recorrências vencidas.
   * Usado pelo agente de IA (antes de responder, garante dados frescos) ou
   * pelo admin. Diferente do cron, este materializa apenas do usuário logado.
   */
  static async runMaterialization(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const created = await recurringService.materializeDue(userId);
      res.json({
        message: 'Materialização concluída',
        created_count: created.length,
        transactions: created
      });
    } catch (error) {
      next(error);
    }
  }
}