import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

/**
 * Função auxiliar para calcular a próxima data de vencimento
 */
function calculateNextDueDate(frequency: string, date: Date): Date {
  const nextDate = new Date(date);
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  return nextDate;
}

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

      const startDate = new Date(start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);

      let nextDueDate: Date;

      if (startDate >= today) {
        nextDueDate = startDate;
      } else {
        nextDueDate = calculateNextDueDate(frequency, startDate);
      }

      // Resolver category_id e category name se necessário
      let finalCategoryId = category_id ? parseInt(category_id) : null;
      let finalCategoryName = category;

      if (finalCategoryId && !finalCategoryName) {
        const cat = await prisma.categories.findUnique({ where: { id: finalCategoryId } });
        if (cat) finalCategoryName = cat.name;
      }

      const recurringTransaction = await prisma.recurring_transactions.create({
        data: {
          user_id: userId,
          description,
          amount: parseFloat(amount),
          category: finalCategoryName,
          category_id: finalCategoryId,
          type,
          frequency,
          start_date: startDate,
          next_due_date: nextDueDate,
          status: 'active',
          entity_id: entity_id ? parseInt(entity_id) : null,
          payment_method: payment_method || 'cash'
        },
        include: {
          categories: true,
          financial_entities: true
        }
      });

      // Se a data de início for hoje, já gerar a primeira transação real
      if (startDate.getTime() === today.getTime()) {
        const account = await prisma.accounts.findFirst({
          where: { users: { some: { id: userId } } }
        });

        if (account) {
          await prisma.transactions.create({
            data: {
              account_id: account.id,
              user_id: userId,
              amount: recurringTransaction.amount,
              type: recurringTransaction.type,
              category: recurringTransaction.category,
              category_id: recurringTransaction.category_id,
              description: recurringTransaction.description,
              transaction_date: startDate,
              status: 'paid',
              is_recurring: true,
              recurring_transaction_id: recurringTransaction.id,
              entity_id: recurringTransaction.entity_id,
              payment_method: recurringTransaction.payment_method
            }
          });

          // Atualizar a próxima data de vencimento, pois a de hoje já foi gerada
          const nextDateAfterToday = calculateNextDueDate(frequency, nextDueDate);
          await prisma.recurring_transactions.update({
            where: { id: recurringTransaction.id },
            data: { next_due_date: nextDateAfterToday }
          });
        }
      }

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
          category_id: finalCategoryId,
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
   * Gera uma transação real a partir de uma recorrente
   */
  static async generateTransaction(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { transaction_date } = req.body;
      const userId = req.userId!;

      const recurringTransaction = await prisma.recurring_transactions.findFirst({
        where: {
          id: Number(id),
          user_id: userId,
          status: 'active'
        }
      });

      if (!recurringTransaction) {
        return res.status(404).json({ error: 'Recurring transaction not found or not active' });
      }

      // Buscar a conta do usuário (assumindo que ele tem uma conta principal ou pegando a primeira)
      const account = await prisma.accounts.findFirst({
        where: {
          users: {
            some: { id: userId }
          }
        }
      });

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const transaction = await prisma.transactions.create({
        data: {
          account_id: account.id,
          user_id: userId,
          amount: recurringTransaction.amount,
          type: recurringTransaction.type,
          category: recurringTransaction.category,
          category_id: recurringTransaction.category_id,
          description: recurringTransaction.description,
          transaction_date: transaction_date ? new Date(transaction_date) : new Date(),
          status: 'paid',
          is_recurring: true,
          recurring_transaction_id: recurringTransaction.id,
          entity_id: recurringTransaction.entity_id,
          payment_method: recurringTransaction.payment_method
        }
      });

      const nextDueDate = calculateNextDueDate(
        recurringTransaction.frequency,
        recurringTransaction.next_due_date
      );

      await prisma.recurring_transactions.update({
        where: { id: recurringTransaction.id },
        data: { next_due_date: nextDueDate }
      });

      res.status(201).json({ transaction, nextDueDate });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista transações recorrentes próximas do vencimento
   */
  static async listDue(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { days = 7 } = req.query;
      const userId = req.userId!;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Number(days));

      const dueTransactions = await prisma.recurring_transactions.findMany({
        where: {
          user_id: userId,
          status: 'active',
          next_due_date: {
            lte: dueDate
          }
        },
        orderBy: {
          next_due_date: 'asc'
        }
      });

      res.json({ dueTransactions });
    } catch (error) {
      next(error);
    }
  }
}