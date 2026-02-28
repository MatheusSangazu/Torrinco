import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

interface BillPeriod {
  startDate: Date;
  endDate: Date;
  closingDate: Date;
  dueDate: Date;
}

function calculateBillPeriod(closingDay: number, dueDay: number, referenceDate: Date = new Date()): BillPeriod {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  
  let closingDate = new Date(year, month, closingDay);
  
  if (referenceDate > closingDate) {
    closingDate = new Date(year, month + 1, closingDay);
  }
  
  const previousClosingDate = new Date(closingDate);
  previousClosingDate.setMonth(previousClosingDate.getMonth() - 1);
  
  let dueDate = new Date(closingDate);
  if (dueDay < closingDay) {
    dueDate = new Date(closingDate.getFullYear(), closingDate.getMonth() + 1, dueDay);
  } else {
    dueDate = new Date(closingDate.getFullYear(), closingDate.getMonth(), dueDay);
  }
  
  return {
    startDate: previousClosingDate,
    endDate: closingDate,
    closingDate,
    dueDate
  };
}

function calculateHistoricalBillPeriod(closingDay: number, dueDay: number, year: number, month: number): BillPeriod {
  const closingDate = new Date(year, month, closingDay);
  const previousClosingDate = new Date(year, month - 1, closingDay);
  
  let dueDate = new Date(year, month, dueDay);
  if (dueDay < closingDay) {
    dueDate = new Date(year, month + 1, dueDay);
  }
  
  return {
    startDate: previousClosingDate,
    endDate: closingDate,
    closingDate,
    dueDate
  };
}

export class CardsController {
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { month, year } = req.query;
      const today = new Date();

      const targetMonth = month ? parseInt(month as string) : today.getMonth();
      const targetYear = year ? parseInt(year as string) : today.getFullYear();

      const cards = await prisma.financial_entities.findMany({
        where: {
          user_id: userId,
          type: 'credit_card'
        },
        orderBy: {
          name: 'asc'
        }
      });

      const cardsWithDetails = await Promise.all(cards.map(async card => {
        const closingDay = card.closing_day || 1;
        const dueDay = card.due_day || 10;
        
        let billPeriod: BillPeriod;
        let isCurrentBill = false;

        if (month && year) {
          billPeriod = calculateHistoricalBillPeriod(closingDay, dueDay, targetYear, targetMonth);
        } else {
          billPeriod = calculateBillPeriod(closingDay, dueDay, today);
          isCurrentBill = true;
        }

        const transactions = await prisma.transactions.findMany({
          where: {
            entity_id: card.id,
            transaction_date: {
              gte: billPeriod.startDate,
              lt: billPeriod.endDate
            },
            deleted_at: null
          },
          include: {
            purchase_installments: true
          },
          orderBy: {
            transaction_date: 'desc'
          }
        });

        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalPayments = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const currentBill = totalExpenses - totalPayments;
        const availableLimit = Number(card.credit_limit || 0) - currentBill;

        const isClosed = today > billPeriod.closingDate;

        // Verificar se já existe um pagamento registrado para esta fatura
        const paymentExists = await prisma.transactions.findFirst({
          where: {
            user_id: userId,
            type: 'expense',
            category: 'Pagamento de Cartão',
            description: {
              contains: card.name
            },
            deleted_at: null
          },
          orderBy: {
            transaction_date: 'desc'
          }
        });

        // Só consideramos o pagamento se ele estiver dentro do período da fatura ou próximo ao vencimento
        const isPaid = paymentExists && 
          new Date(paymentExists.transaction_date) >= new Date(billPeriod.startDate.getTime() - 86400000) &&
          new Date(paymentExists.transaction_date) <= new Date(billPeriod.dueDate.getTime() + 86400000);

        return {
          id: card.id,
          name: card.name,
          limit: Number(card.credit_limit || 0),
          currentBill,
          availableLimit,
          closingDay,
          dueDay,
          periodStart: billPeriod.startDate,
          periodEnd: billPeriod.endDate,
          closingDate: billPeriod.closingDate,
          dueDate: billPeriod.dueDate,
          status: isPaid ? 'paid' : (isClosed ? 'closed' : 'open'),
          isPaid: !!isPaid,
          paymentId: isPaid ? paymentExists.id : undefined,
          transactionCount: transactions.length,
          transactions,
          color: card.color || 'from-purple-600 to-indigo-700',
          isCurrentBill
        };
      }));

      res.json({ cards: cardsWithDetails });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo cartão de crédito
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { name, limit, closing_day, due_day, color } = req.body;
      const userId = req.userId!;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const card = await prisma.financial_entities.create({
        data: {
          user_id: userId,
          name,
          type: 'credit_card',
          credit_limit: limit ? parseFloat(limit) : 0,
          closing_day: closing_day ? parseInt(closing_day) : null,
          due_day: due_day ? parseInt(due_day) : null,
          color: color || 'from-purple-600 to-indigo-700',
          // balance é usado para saldo inicial ou acumulado, vamos iniciar com 0
          balance: 0
        }
      });

      res.status(201).json({ card });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um cartão
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, limit, closing_day, due_day, color } = req.body;
      const userId = req.userId!;

      const card = await prisma.financial_entities.update({
        where: { id: Number(id), user_id: userId },
        data: {
          name,
          credit_limit: limit !== undefined ? (limit ? parseFloat(limit) : 0) : undefined,
          closing_day: closing_day !== undefined ? (closing_day ? parseInt(closing_day) : null) : undefined,
          due_day: due_day !== undefined ? (due_day ? parseInt(due_day) : null) : undefined,
          color: color !== undefined ? color : undefined
        }
      });

      res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  static async getBillHistory(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { months = 6 } = req.query;
      const userId = req.userId!;

      const card = await prisma.financial_entities.findFirst({
        where: {
          id: Number(id),
          user_id: userId,
          type: 'credit_card'
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const closingDay = card.closing_day || 1;
      const dueDay = card.due_day || 10;
      const historyLength = Math.min(parseInt(months as string), 24);

      const bills = [];
      const today = new Date();

      for (let i = 0; i < historyLength; i++) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const billPeriod = calculateHistoricalBillPeriod(closingDay, dueDay, targetDate.getFullYear(), targetDate.getMonth());

        const transactions = await prisma.transactions.findMany({
          where: {
            entity_id: card.id,
            transaction_date: {
              gte: billPeriod.startDate,
              lt: billPeriod.endDate
            },
            deleted_at: null
          },
          include: {
            purchase_installments: true
          },
          orderBy: {
            transaction_date: 'desc'
          }
        });

        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalPayments = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const billAmount = totalExpenses - totalPayments;
        const isPaid = totalPayments >= totalExpenses;

        bills.push({
          period: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`,
          startDate: billPeriod.startDate,
          endDate: billPeriod.endDate,
          closingDate: billPeriod.closingDate,
          dueDate: billPeriod.dueDate,
          totalExpenses,
          totalPayments,
          billAmount,
          status: isPaid ? 'paid' : (today > billPeriod.dueDate ? 'overdue' : 'pending'),
          transactionCount: transactions.length,
          transactions
        });
      }

      res.json({ bills });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove um cartão
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      
      // Verificar se tem transações antes de deletar (opcional, mas seguro)
      const transactions = await prisma.transactions.count({
        where: { entity_id: Number(id) }
      });

      if (transactions > 0) {
        return res.status(400).json({ error: 'Cannot delete card with transactions' });
      }

      await prisma.financial_entities.delete({
        where: { id: Number(id), user_id: userId }
      });

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
