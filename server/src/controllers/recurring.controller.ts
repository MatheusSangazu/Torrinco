import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

function parseLocalDate(dateString: string): Date {
  if (!dateString) {
    return new Date();
  }
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0] || '0', 10);
    const month = parseInt(parts[1] || '0', 10) - 1;
    const day = parseInt(parts[2] || '0', 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day, 12, 0, 0);
      return date;
    }
  }
  return new Date(dateString);
}

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

      console.log('DEBUG: createTransaction body', { start_date, frequency, type });

      if (!description || !amount || !type || !frequency || !start_date) {
        return res.status(400).json({ 
          error: 'Description, amount, type, frequency and start_date are required' 
        });
      }

      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Type must be income or expense' });
      }

      const startDate = parseLocalDate(start_date);
      console.log('DEBUG: parsed startDate (local 12:00)', startDate.toISOString());
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

      console.log('DEBUG: calculated today (local 12:00)', today.toISOString());
      
      let nextDueDate: Date;

      const isToday = startDate.getFullYear() === today.getFullYear() &&
                      startDate.getMonth() === today.getMonth() &&
                      startDate.getDate() === today.getDate();

      console.log('DEBUG: isToday', isToday);

      // Se a data de início é hoje ou futuro, a próxima data é a própria data de início
      if (startDate.getTime() >= today.getTime()) {
        nextDueDate = startDate;
      } else {
        // Se é passado, calcular a próxima ocorrência a partir da data de início até chegar em hoje ou futuro
        // Mas a lógica original apenas calculava UMA vez.
        // Se a data for muito antiga, deveria avançar até hoje?
        // A lógica original:
        // if (startDate >= today || isToday) nextDueDate = startDate
        // else nextDueDate = calculateNextDueDate(frequency, startDate)
        
        // Se startDate é ontem, nextDueDate vira hoje (se diário) ou mês que vem (se mensal).
        // Vamos manter a lógica original mas com datas UTC
        nextDueDate = calculateNextDueDate(frequency, startDate);
        
        // Se a frequência for mensal e a data for mês passado, isso traz para este mês.
        // Se for 2 meses atrás, ainda fica no passado?
        // O comportamento original parecia assumir apenas um passo.
        // Se o usuário cria algo antigo, talvez queira apenas registrar o histórico e começar a cobrar?
        // Vamos manter o comportamento simples: se passou, calcula o próximo.
        // Se ainda estiver no passado, o job de cron ou listDue vai pegar depois?
        
        // Ajuste: Se a data de início for no passado, o createTransaction DEVERIA criar a transação do passado?
        // O código original criava SE fosse "isToday".
        // Se for passado, ele NÃO cria a transação passada. Ele apenas agenda a próxima.
        // Isso significa que se eu criar algo com data de ontem, ele agenda para mês que vem (se mensal) e NÃO cria a de ontem.
        // O usuário pode achar isso estranho. Mas é o comportamento original.
      }
      
      console.log('DEBUG: calculated nextDueDate', nextDueDate.toISOString());

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
          type,
          frequency,
          start_date: startDate,
          next_due_date: nextDueDate,
          status: 'active',
          entity_id: entity_id ? parseInt(entity_id) : null,
          payment_method: payment_method || 'cash'
        }
      });

      // Se a data de início for hoje, já gerar a primeira transação real
      if (isToday) {
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
          transaction_date: transaction_date ? parseLocalDate(transaction_date) : new Date(),
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
      // Ajustar para UTC para garantir comparação consistente com o banco
      dueDate.setUTCDate(dueDate.getUTCDate() + Number(days));
      dueDate.setUTCHours(23, 59, 59, 999);

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