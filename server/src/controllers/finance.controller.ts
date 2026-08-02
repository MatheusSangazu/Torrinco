import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { parseDate } from '../lib/date-utils.js';
import { projectRecurringTransactions } from '../lib/transaction-projection.js';
import * as billing from '../services/billing.service.js';
import * as summary from '../services/summary.service.js';

export class FinanceController {
  /**
   * Projeção de transações recorrentes (Mantido para compatibilidade interna se necessário, mas prefira a lib)
   */
  private static projectRecurringTransactions(
    recurringTransactions: any[],
    start: Date,
    end: Date,
    transactionsForCheck: any[]
  ): any[] {
    return projectRecurringTransactions(recurringTransactions, start, end, transactionsForCheck);
  }

  /**
   * Cria uma nova transação
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const { amount, type, category, category_id, income_source_id, description, transaction_date, status, entity_id, is_recurring, payment_method, target_user_id } = req.body;
      let userId = req.userId!;
      const accountId = req.accountId!;

      // Se for admin e enviar target_user_id, usa o ID do alvo
      if (req.userRole === 'admin' && target_user_id) {
        userId = Number(target_user_id);
      }

      if (!amount || !type || !transaction_date) {
        return res.status(400).json({ error: 'Amount, type and transaction_date are required' });
      }

      if (!['expense', 'income'].includes(type)) {
        return res.status(400).json({ error: 'Type must be expense or income' });
      }

      // Resolver category_id
      let finalCategoryId = category_id ? Number(category_id) : null;
      let finalCategoryName = category;

      // Se não veio ID mas veio nome, tentar encontrar ou criar
      if (!finalCategoryId && category) {
        const existingCategory = await prisma.categories.findFirst({
          where: {
            account_id: accountId,
            name: category,
            type
          }
        });

        if (existingCategory) {
          finalCategoryId = existingCategory.id;
        } else {
          // Criar nova categoria automaticamente
          const newCategory = await prisma.categories.create({
            data: {
              account_id: accountId,
              name: category,
              type,
              color: type === 'income' ? '#22c55e' : '#ef4444'
            }
          });
          finalCategoryId = newCategory.id;
        }
      } else if (finalCategoryId) {
        // Se veio ID, buscar o nome para preencher o campo legado
        const cat = await prisma.categories.findUnique({
          where: { id: finalCategoryId }
        });
        if (cat) {
          finalCategoryName = cat.name;
        }
      }

      // Resolver income_source_id
      let finalIncomeSourceId = income_source_id ? Number(income_source_id) : null;

      // Validar que income_source_id só pode ser usado com tipo 'income'
      if (finalIncomeSourceId && type !== 'income') {
        return res.status(400).json({ error: 'Income source can only be used with income type' });
      }

      // Validar que income_source_id existe e pertence ao usuário
      if (finalIncomeSourceId) {
        const incomeSource = await prisma.income_sources.findFirst({
          where: {
            id: finalIncomeSourceId,
            user_id: userId
          }
        });

        if (!incomeSource) {
          return res.status(400).json({ error: 'Invalid income source' });
        }
      }

      const parsedDate = parseDate(transaction_date);

      const transaction = await prisma.transactions.create({
        data: {
          account_id: accountId,
          user_id: userId,
          entity_id: entity_id ? Number(entity_id) : null,
          amount: parseFloat(amount),
          type,
          category: finalCategoryName,
          category_id: finalCategoryId,
          income_source_id: finalIncomeSourceId,
          description,
          transaction_date: parsedDate,
          status: status || 'paid',
          is_recurring: is_recurring || false,
          payment_method: payment_method || 'cash'
        },
        include: {
          financial_entities: true,
          categories: true,
          income_sources: true
        }
      });

      res.status(201).json({ transaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista transações com filtros
   */
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const { start_date, end_date, type, category, status } = req.query;
      const userId = req.userId!;

      const where: any = {
        user_id: userId
        // deleted_at is NOT filtered here to include deleted transactions for duplicate check
       };

       if (start_date || end_date) {
         where.transaction_date = {};
         if (start_date) {
           const startDate = parseDate(start_date as string);
           startDate.setHours(0, 0, 0, 0);
           where.transaction_date.gte = startDate;
         }
         if (end_date) {
           const endDate = parseDate(end_date as string);
           endDate.setHours(23, 59, 59, 999);
           where.transaction_date.lte = endDate;
         }
       } else {
         return res.status(400).json({ error: 'start_date and end_date are required' });
       }

       // Buscar todas as transações no período, incluindo deletadas
       const transactionsRaw = await prisma.transactions.findMany({
         where,
         include: {
           financial_entities: true,
           categories: true,
           income_sources: true,
           accounts: true,
           purchase_installments: true
         },
         orderBy: {
           transaction_date: 'desc'
         }
       });

       // Filtrar apenas as que devem ser retornadas para o frontend (não deletadas)
       let transactions = transactionsRaw.filter(t => t.deleted_at === null);
       
       // Aplicar filtros de type/category na memória
       if (type) transactions = transactions.filter(t => t.type === type);
       if (category) transactions = transactions.filter(t => t.category === category);
      // if (status) transactions = transactions.filter(t => t.status === status); // Status filter might be tricky

      // Transações para verificação de duplicidade (inclui deletadas)
      const transactionsForCheck = transactionsRaw;

      // Buscar transações recorrentes ativas que venceriam neste período.
      // Fallback seguro: se não houver filtro de data, usa o mês atual.
      const now = new Date();
      const start = where.transaction_date?.gte ? new Date(where.transaction_date.gte) : new Date(now.getFullYear(), now.getMonth(), 1);
      const end = where.transaction_date?.lte ? new Date(where.transaction_date.lte) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        // Sem janela válida → não projeta recorrências (evita Invalid Date no Prisma).
        return res.json({ transactions });
      }

      const recurringTransactions = await prisma.recurring_transactions.findMany({
        where: {
          user_id: userId,
          status: 'active',
          start_date: { lte: end }
        }
      });

      // Transformar recorrentes em formato de transação para visualização
      const projectedRecurring = FinanceController.projectRecurringTransactions(
        recurringTransactions,
        start,
        end,
        transactionsForCheck
      );

      // Combinar transações reais com projeções e ordenar
      const allTransactions = [...transactions, ...projectedRecurring].sort((a, b) => 
        new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
      );

      res.json({ transactions: allTransactions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém uma transação específica
   */
  static async getById(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const transaction = await prisma.transactions.findFirst({
        where: {
          id: Number(id),
          user_id: userId,
          deleted_at: null
        },
        include: {
          financial_entities: true,
          accounts: true,
          income_sources: true
        }
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ transaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza uma transação
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const { id } = req.params;
      const { amount, type, category, category_id, income_source_id, description, transaction_date, status, entity_id, payment_method, is_recurring } = req.body;
      const userId = req.userId!;

      const transaction = await prisma.transactions.findFirst({
        where: { id: Number(id), user_id: userId },
        include: {
          financial_entities: true,
          categories: true,
          income_sources: true
        }
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Validar income_source_id se fornecido
      let finalIncomeSourceId = income_source_id !== undefined ? (income_source_id ? Number(income_source_id) : null) : undefined;

      if (finalIncomeSourceId !== undefined) {
        // Validar que income_source_id só pode ser usado com tipo 'income'
        if (finalIncomeSourceId && (type && type !== 'income')) {
          return res.status(400).json({ error: 'Income source can only be used with income type' });
        }

        // Validar que income_source_id existe e pertence ao usuário
        if (finalIncomeSourceId) {
          const incomeSource = await prisma.income_sources.findFirst({
            where: {
              id: finalIncomeSourceId,
              user_id: userId
            }
          });

          if (!incomeSource) {
            return res.status(400).json({ error: 'Invalid income source' });
          }
        }
      }

      const updatedTransaction = await prisma.transactions.update({
        where: { id: Number(id) },
        data: {
          amount: amount ? parseFloat(amount) : undefined,
          type: type ?? undefined,
          category: category ?? undefined,
          category_id: category_id ? Number(category_id) : (category_id === null ? null : undefined),
          income_source_id: finalIncomeSourceId !== undefined ? finalIncomeSourceId : undefined,
          description: description ?? undefined,
          transaction_date: transaction_date ? parseDate(transaction_date) : undefined,
          status: status ?? undefined,
          entity_id: entity_id ? Number(entity_id) : (entity_id === null ? null : undefined),
          payment_method: payment_method ?? undefined,
          is_recurring: is_recurring !== undefined ? is_recurring : undefined
        },
        include: {
          financial_entities: true,
          categories: true,
          income_sources: true
        }
      });

      res.json({ transaction: updatedTransaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exclusão lógica de uma transação
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const { id } = req.params;
      const { delete_type, is_projected, date } = req.query;
      const userId = req.userId!;

      if (!id) {
        return res.status(400).json({ error: 'Transaction ID is required' });
      }

      // Se for uma transação projetada (começa com "rec-")
      if (is_projected === 'true' || id.toString().startsWith('rec-')) {
        // Extrair ID da transação recorrente original e data
        // Formato esperado: rec-{id}-{timestamp}
        const parts = id.toString().split('-');
        
        if (parts.length < 3) {
          return res.status(400).json({ error: 'Invalid projected transaction format' });
        }
        
        const recurringId = parseInt(parts[1] || '');
        const timestamp = parseInt(parts[2] || '');
        
        if (isNaN(recurringId) || isNaN(timestamp)) {
          return res.status(400).json({ error: 'Invalid projected transaction data' });
        }
        
        const projectionDate = new Date(timestamp);

        if (delete_type === 'all') {
          
          await prisma.recurring_transactions.update({
            where: { id: recurringId, user_id: userId },
            data: { status: 'cancelled' } 
          });
          return res.json({ message: 'Recurring transaction cancelled successfully' });
        } else {
          
          const recurring = await prisma.recurring_transactions.findFirst({
            where: { id: recurringId, user_id: userId }
          });

          if (!recurring) return res.status(404).json({ error: 'Recurring transaction not found' });

          // Buscar conta padrão do usuário
          const user = await prisma.users.findUnique({ where: { id: userId } });
          if (!user) return res.status(404).json({ error: 'User not found' });

          await prisma.transactions.create({
            data: {
              user_id: userId,
              account_id: user.account_id,
              description: recurring.description,
              amount: recurring.amount,
              type: recurring.type === 'income' ? 'income' : 'expense', // Ajuste de tipo
              category: recurring.category,
              transaction_date: projectionDate,
              is_recurring: true,
              recurring_transaction_id: recurring.id,
              status: 'paid', // Status padrão, mas com deleted_at preenchido
              deleted_at: new Date(),
              payment_method: 'pix' // Padrão
            }
          });
          return res.json({ message: 'Instance cancelled successfully' });
        }
      }

      // Se for uma transação real 
      const existingTransaction = await prisma.transactions.findFirst({
        where: { id: Number(id), user_id: userId }
      });

      if (!existingTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (delete_type === 'all' && existingTransaction.recurring_transaction_id) {
        
        await prisma.recurring_transactions.update({
          where: { id: existingTransaction.recurring_transaction_id },
          data: { status: 'cancelled' }
        });
      }

      // Se for uma parcela e delete_type for 'all', excluir todas as parcelas da compra
      if (delete_type === 'all' && existingTransaction.installment_id) {
        await prisma.transactions.updateMany({
          where: {
            installment_id: existingTransaction.installment_id,
            user_id: userId,
            deleted_at: null
          },
          data: { deleted_at: new Date() }
        });

        // Marcar a compra de parcelas como cancelada
        await prisma.purchase_installments.update({
          where: { id: existingTransaction.installment_id },
          data: { status: 'cancelled' }
        });
      } else {

        await prisma.transactions.update({
          where: { id: Number(id) },
          data: { deleted_at: new Date() }
        });
      }

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /** Resumo do mês (dashboard) — delega ao summary.service. */
  static async getSummary(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      let userId = req.userId!;
      const { period, target_user_id } = req.query;
      if (req.userRole === 'admin' && target_user_id) userId = Number(target_user_id);

      const result = await summary.getSummary(
        userId,
        (period === 'all' ? 'all' : 'month')
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getForecast(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      let userId = req.userId!;
      const { target_user_id } = req.query;
      const period = (req.query.period as string) || 'next_month';

      // Se for admin e enviar target_user_id, usa o ID do alvo
      if (req.userRole === 'admin' && target_user_id) {
        userId = Number(target_user_id);
      }

      const result = await summary.getForecast(
        userId,
        (period === 'current_month' ? 'current_month' : 'next_month')
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /** Fatura atual — delega ao billing.service (fonte única). Compatibilidade front antigo. */
  static async getCardBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const userId = req.userId!;
      const { bill, card, period } = await billing.getOrCreateCurrentBill(Number(cardId), userId);
      const details = await billing.getBillDetails(bill.id, userId);
      res.json({
        card: {
          id: card.id,
          name: card.name,
          color: card.color,
          limit: card.credit_limit,
          closingDay: card.closing_day,
          dueDay: card.due_day,
          availableLimit: Number(card.credit_limit) - details.bill.total_amount
        },
        bill: {
          startDate: period.periodStart,
          endDate: period.periodEnd,
          closingDate: period.closingDate,
          dueDate: period.dueDate,
          totalExpenses: details.bill.total_amount,
          transactionCount: details.bill.items.length,
          transactions: details.bill.items,
          status: bill.status,
          isPaid: bill.status === 'paid',
          paymentId: bill.payment_transaction_id ?? undefined,
          billId: bill.id
        }
      });
    } catch (error: any) {
      res.status(error?.message === 'CARD_NOT_FOUND' ? 404 : 400).json({ error: error?.message });
    }
  }

  /** Próxima fatura — delega ao billing.service (offset +1). Compatibilidade front antigo. */
  static async getCardNextBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const userId = req.userId!;
      const result = await billing.getBillByOffset(Number(cardId), userId, 1);
      if (!result.bill) return res.status(404).json({ error: 'Bill not found for this period' });
      const details = await billing.getBillDetails(result.bill.id, userId);
      res.json({
        card: {
          id: result.card.id,
          name: result.card.name,
          color: result.card.color,
          limit: result.card.credit_limit,
          closingDay: result.card.closing_day,
          dueDay: result.card.due_day
        },
        bill: {
          startDate: result.period.periodStart,
          endDate: result.period.periodEnd,
          closingDate: result.period.closingDate,
          dueDate: result.period.dueDate,
          totalExpenses: details.bill.total_amount,
          transactionCount: details.bill.items.length,
          transactions: details.bill.items
        }
      });
    } catch (error: any) {
      res.status(error?.message === 'CARD_NOT_FOUND' ? 404 : 400).json({ error: error?.message });
    }
  }

  /** Fatura anterior — delega ao billing.service (offset -1). Compatibilidade front antigo. */
  static async getCardPreviousBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const userId = req.userId!;
      const result = await billing.getBillByOffset(Number(cardId), userId, -1);
      if (!result.bill) return res.status(404).json({ error: 'Bill not found for this period' });
      const details = await billing.getBillDetails(result.bill.id, userId);
      res.json({
        card: {
          id: result.card.id,
          name: result.card.name,
          color: result.card.color,
          limit: result.card.credit_limit,
          closingDay: result.card.closing_day,
          dueDay: result.card.due_day
        },
        bill: {
          startDate: result.period.periodStart,
          endDate: result.period.periodEnd,
          closingDate: result.period.closingDate,
          dueDate: result.period.dueDate,
          totalExpenses: details.bill.total_amount,
          transactionCount: details.bill.items.length,
          transactions: details.bill.items,
          status: result.bill.status,
          isPaid: result.bill.status === 'paid',
          paymentId: result.bill.payment_transaction_id ?? undefined,
          billId: result.bill.id
        }
      });
    } catch (error: any) {
      res.status(error?.message === 'CARD_NOT_FOUND' ? 404 : 400).json({ error: error?.message });
    }
  }
}