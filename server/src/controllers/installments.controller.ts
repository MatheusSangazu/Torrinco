import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

interface CreateInstallmentDTO {
  entity_id: number;
  description: string;
  amount: number;
  installment_count: number;
  start_date: string;
  category?: string;
  category_id?: number;
}

export class InstallmentsController {
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { entity_id, description, amount, installment_count, start_date, category, category_id }: CreateInstallmentDTO = req.body;

      if (!entity_id || !description || !amount || !installment_count || !start_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const card = await prisma.financial_entities.findFirst({
        where: {
          id: entity_id,
          user_id: userId,
          type: 'credit_card'
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const installmentValue = amount / installment_count;
      const startDate = new Date(start_date);
      const closingDay = card.closing_day || 1;
      const dueDay = card.due_day || 10;

      const purchase = await prisma.purchase_installments.create({
        data: {
          user_id: userId,
          entity_id,
          description,
          amount,
          installment_count,
          installment_value: installmentValue,
          start_date: startDate,
          status: 'active'
        }
      });

      const account = await prisma.accounts.findFirst({
        where: { users: { some: { id: userId } } }
      });

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const transactions = [];
      for (let i = 0; i < installment_count; i++) {
        const installmentNumber = i + 1;
        
        let transactionDate = new Date(startDate);
        transactionDate.setMonth(transactionDate.getMonth() + i);

        const transaction = await prisma.transactions.create({
          data: {
            account_id: account.id,
            user_id: userId,
            entity_id,
            amount: installmentValue,
            type: 'expense',
            status: 'paid',
            category: category || null,
            category_id: category_id || null,
            description: `${description} (${installmentNumber}/${installment_count})`,
            transaction_date: transactionDate,
            installment_id: purchase.id,
            installment_number: installmentNumber,
            payment_method: 'credit_card'
          }
        });

        transactions.push(transaction);
      }

      res.status(201).json({ 
        purchase: {
          id: purchase.id,
          description: purchase.description,
          amount: Number(purchase.amount),
          installment_count: purchase.installment_count,
          installment_value: Number(purchase.installment_value),
          start_date: purchase.start_date,
          status: purchase.status
        },
        transactions
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { entity_id, status } = req.query;

      const where: any = {
        user_id: userId
      };

      if (entity_id) {
        where.entity_id = Number(entity_id);
      }

      if (status) {
        where.status = status;
      }

      const purchases = await prisma.purchase_installments.findMany({
        where,
        include: {
          financial_entities: true,
          transactions: {
            orderBy: {
              installment_number: 'asc'
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      const purchasesWithDetails = purchases.map(purchase => {
        const paidInstallments = purchase.transactions.filter(t => t.status === 'paid').length;
        const remainingInstallments = purchase.installment_count - paidInstallments;

        return {
          id: purchase.id,
          description: purchase.description,
          amount: Number(purchase.amount),
          installment_count: purchase.installment_count,
          installment_value: Number(purchase.installment_value),
          first_installment: purchase.first_installment,
          start_date: purchase.start_date,
          status: purchase.status,
          card: purchase.financial_entities,
          paid_installments: paidInstallments,
          remaining_installments: remainingInstallments,
          transactions: purchase.transactions.map(t => ({
            id: t.id,
            installment_number: t.installment_number,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            status: t.status,
            description: t.description
          }))
        };
      });

      res.json({ purchases: purchasesWithDetails });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const purchase = await prisma.purchase_installments.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        },
        include: {
          financial_entities: true,
          transactions: {
            orderBy: {
              installment_number: 'asc'
            }
          }
        }
      });

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      const paidInstallments = purchase.transactions.filter(t => t.status === 'paid').length;
      const remainingInstallments = purchase.installment_count - paidInstallments;

      res.json({
        purchase: {
          id: purchase.id,
          description: purchase.description,
          amount: Number(purchase.amount),
          installment_count: purchase.installment_count,
          installment_value: Number(purchase.installment_value),
          first_installment: purchase.first_installment,
          start_date: purchase.start_date,
          status: purchase.status,
          card: purchase.financial_entities,
          paid_installments: paidInstallments,
          remaining_installments: remainingInstallments,
          transactions: purchase.transactions.map(t => ({
            id: t.id,
            installment_number: t.installment_number,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            status: t.status,
            description: t.description
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const purchase = await prisma.purchase_installments.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        },
        include: {
          transactions: true
        }
      });

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      if (purchase.status === 'cancelled') {
        return res.status(400).json({ error: 'Purchase already cancelled' });
      }

      await prisma.purchase_installments.update({
        where: { id: Number(id) },
        data: { status: 'cancelled' }
      });

      const today = new Date();
      await Promise.all(
        purchase.transactions.map(transaction =>
          prisma.transactions.update({
            where: { id: transaction.id },
            data: {
              deleted_at: transaction.transaction_date > today ? today : transaction.transaction_date
            }
          })
        )
      );

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.userId!;

      if (!['active', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const purchase = await prisma.purchase_installments.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        }
      });

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      const updatedPurchase = await prisma.purchase_installments.update({
        where: { id: Number(id) },
        data: { status }
      });

      res.json({ purchase: updatedPurchase });
    } catch (error) {
      next(error);
    }
  }
}
