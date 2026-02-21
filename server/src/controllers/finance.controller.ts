import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { addMonths } from '../lib/date-utils.js';

export class FinanceController {
  /**
   * Projeção de transações recorrentes
   */
  private static projectRecurringTransactions(
    recurringTransactions: any[],
    start: Date,
    end: Date,
    transactionsForCheck: any[]
  ): any[] {
    const projectedRecurring: any[] = [];
    
    for (const rt of recurringTransactions) {
      const rtStartDate = new Date(rt.start_date);

      let currentDate = new Date(rtStartDate);

      if (rt.frequency === 'monthly') {
        const monthsDiff = (start.getFullYear() - rtStartDate.getFullYear()) * 12 + (start.getMonth() - rtStartDate.getMonth());
        if (monthsDiff > 0) {
          currentDate = addMonths(rtStartDate, monthsDiff);
        }
      } else if (rt.frequency === 'yearly') {
        const yearsDiff = start.getFullYear() - rtStartDate.getFullYear();
        if (yearsDiff > 0) {
          currentDate.setFullYear(rtStartDate.getFullYear() + yearsDiff);
        }
      } else {
        while (currentDate < start) {
          if (rt.frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
          else if (rt.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
        }
      }

      while (currentDate < start) {
        if (rt.frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
        else if (rt.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
        else if (rt.frequency === 'monthly') currentDate = addMonths(currentDate, 1);
        else if (rt.frequency === 'yearly') currentDate.setFullYear(currentDate.getFullYear() + 1);
      }

      while (currentDate <= end) {
        const existingTransaction = transactionsForCheck.find(t => 
          t.is_recurring && 
          t.type === rt.type &&
          t.description === rt.description && 
          Math.abs(Number(t.amount) - Number(rt.amount)) < 0.01 &&
          new Date(t.transaction_date).getDate() === currentDate.getDate() &&
          new Date(t.transaction_date).getMonth() === currentDate.getMonth() &&
          new Date(t.transaction_date).getFullYear() === currentDate.getFullYear()
        );

        if (!existingTransaction) {
          projectedRecurring.push({
            id: `rec-${rt.id}-${currentDate.getTime()}`,
            amount: rt.amount,
            type: rt.type,
            category: rt.category,
            description: rt.description,
            transaction_date: new Date(currentDate),
            status: 'pending',
            is_recurring: true,
            is_projected: true,
            payment_method: 'pix'
          });
        }
        
        if (rt.frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
        else if (rt.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
        else if (rt.frequency === 'monthly') currentDate = addMonths(currentDate, 1);
        else if (rt.frequency === 'yearly') currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
    
    return projectedRecurring;
  }

  /**
   * Cria uma nova transação
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const { amount, type, category, category_id, income_source_id, description, transaction_date, status, entity_id, is_recurring, payment_method } = req.body;
      const userId = req.userId!;
      const accountId = req.accountId!;

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
            user_id: userId,
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
              user_id: userId,
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
          transaction_date: new Date(transaction_date),
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
           const startDate = new Date(start_date as string);
           startDate.setHours(0, 0, 0, 0);
           where.transaction_date.gte = startDate;
         }
         if (end_date) {
           const endDate = new Date(end_date as string);
           endDate.setHours(23, 59, 59, 999);
           where.transaction_date.lte = endDate;
         }
       } else {
         return res.status(400).json({ error: 'start_date and end_date are required' });
       }

       // Note: type/category filters are applied in memory for 'transactions' response, 
       // but we fetch all types/categories to ensure we don't miss a duplicate check if user changes category?
       // Actually, duplicate check checks description and amount. If category changed, it might not match?
       // The check: t.description === rt.description && Math.abs(t.amount - rt.amount) < 0.01
       // So we should probably fetch all types/categories in the date range just to be safe, 
       // or at least fetch enough. Fetching all in date range is safer.

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

      // Buscar transações recorrentes ativas que venceriam neste mês
      const start = start_date ? new Date(start_date as string) : new Date(0);
      const end = end_date ? new Date(end_date as string) : new Date(2100, 0, 1);

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
          categories: true
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
          income_source_id: finalIncomeSourceId !== undefined ? finalIncomeSourceId : undefined,
          description: description ?? undefined,
          transaction_date: transaction_date ? new Date(transaction_date) : undefined,
          status: status ?? undefined,
          entity_id: entity_id ? Number(entity_id) : undefined,
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
          
          const recurring = await prisma.recurring_transactions.findUnique({
            where: { id: recurringId }
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

  /**
   * Obtém resumo financeiro (Dashboard)
   */
  static async getSummary(req: JwtRequest, res: Response, next: NextFunction) {
   
    try {
      const userId = req.userId!;
      const { period } = req.query;
      
      const now = new Date();
      let dateFilter: { gte?: Date; lte?: Date } | undefined = undefined;

      if (period === 'all') {
        dateFilter = undefined;
      } else {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);
        dateFilter = {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        };
      }

      const [
        income,
        expense,
        expenseCash
      ] = await Promise.all([
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'income',
            transaction_date: dateFilter,
            deleted_at: null
          },
          _sum: { amount: true }
        }),
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            transaction_date: dateFilter,
            deleted_at: null
          },
          _sum: { amount: true }
        }),
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            payment_method: { in: ['cash', 'pix', 'debit'] },
            transaction_date: dateFilter,
            deleted_at: null
          },
          _sum: { amount: true }
        })
      ]);

      const cashBalance = (Number(income._sum.amount) || 0) - (Number(expenseCash._sum.amount) || 0);

      res.json({
        month_summary: {
          income: income._sum.amount || 0,
          expense: expense._sum.amount || 0,
          balance: (Number(income._sum.amount) || 0) - (Number(expense._sum.amount) || 0),
          cash_balance: cashBalance
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getForecast(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const period = (req.query.period as string) || 'next_month';

      let dateFilter: any = {};

      if (period === 'next_month') {
        const today = new Date();
        const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        firstDayNextMonth.setHours(0, 0, 0, 0);
        lastDayNextMonth.setHours(23, 59, 59, 999);
        dateFilter = {
          gte: firstDayNextMonth,
          lte: lastDayNextMonth
        };
      } else if (period === 'month') {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);
        dateFilter = {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        };
      }

      const today = new Date();
      const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

      const [recurringIncome, recurringExpenses] = await Promise.all([
        prisma.recurring_transactions.aggregate({
          where: {
            user_id: userId,
            type: 'income',
            status: 'active',
            next_due_date: {
              gte: firstDayNextMonth,
              lte: lastDayNextMonth
            }
          },
          _sum: { amount: true },
          _count: true
        }),
        prisma.recurring_transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            status: 'active',
            next_due_date: {
              gte: firstDayNextMonth,
              lte: lastDayNextMonth
            }
          },
          _sum: { amount: true },
          _count: true
        })
      ]);

      const forecastIncome = Number(recurringIncome._sum.amount) || 0;
      const forecastExpenses = Number(recurringExpenses._sum.amount) || 0;
      const forecastBalance = forecastIncome - forecastExpenses;

      const [recurringIncomeList, recurringExpenseList] = await Promise.all([
        prisma.recurring_transactions.findMany({
          where: {
            user_id: userId,
            type: 'income',
            status: 'active',
            next_due_date: {
              gte: firstDayNextMonth,
              lte: lastDayNextMonth
            }
          },
          select: {
            description: true,
            amount: true,
            next_due_date: true
          }
        }),
        prisma.recurring_transactions.findMany({
          where: {
            user_id: userId,
            type: 'expense',
            status: 'active',
            next_due_date: {
              gte: firstDayNextMonth,
              lte: lastDayNextMonth
            }
          },
          select: {
            description: true,
            amount: true,
            next_due_date: true
          }
        })
      ]);

      res.json({
        period: period === 'next_month' ? 'Próximo Mês' : 'Mês Atual',
        forecast: {
          income: forecastIncome,
          expenses: forecastExpenses,
          balance: forecastBalance,
          breakdown: {
            recurring_income: recurringIncomeList,
            recurring_expenses: recurringExpenseList
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCardBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const userId = req.userId!;

      const card = await prisma.financial_entities.findFirst({
        where: {
          id: Number(cardId),
          user_id: userId,
          type: 'credit_card'
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const closingDay = card.closing_day || 15;
      const dueDay = card.due_day || 25;

      const today = new Date();
      const currentMonthClosingDate = new Date(today.getFullYear(), today.getMonth(), closingDay, 23, 59, 59, 999);
      const previousMonthClosingDate = new Date(today.getFullYear(), today.getMonth() - 1, closingDay + 1, 0, 0, 0, 0);
      const dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);

      if (today > currentMonthClosingDate) {
        previousMonthClosingDate.setMonth(today.getMonth());
        previousMonthClosingDate.setDate(closingDay + 1);
        currentMonthClosingDate.setMonth(today.getMonth() + 1);
        dueDate.setMonth(today.getMonth() + 1);
      }

      const transactions = await prisma.transactions.findMany({
        where: {
          user_id: userId,
          entity_id: Number(cardId),
          type: 'expense',
          transaction_date: {
            gte: previousMonthClosingDate,
            lte: currentMonthClosingDate
          },
          deleted_at: null
        },
        include: {
          categories: true,
          purchase_installments: true
        },
        orderBy: {
          transaction_date: 'desc'
        }
      });

      const totalExpenses = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

      res.json({
        card: {
          id: card.id,
          name: card.name,
          color: card.color,
          limit: card.credit_limit,
          closingDay,
          dueDay
        },
        bill: {
          startDate: previousMonthClosingDate,
          endDate: currentMonthClosingDate,
          closingDate: currentMonthClosingDate,
          dueDate,
          totalExpenses,
          transactionCount: transactions.length,
          transactions: transactions.map(t => ({
            id: t.id,
            description: t.description,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            type: t.type,
            category: t.categories?.name,
            installment_number: t.installment_number,
            installment_id: t.installment_id,
            purchase_installments: t.purchase_installments ? {
              description: t.purchase_installments.description,
              installment_count: t.purchase_installments.installment_count,
              installment_value: Number(t.purchase_installments.installment_value)
            } : null
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCardNextBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const userId = req.userId!;

      const card = await prisma.financial_entities.findFirst({
        where: {
          id: Number(cardId),
          user_id: userId,
          type: 'credit_card'
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const closingDay = card.closing_day || 15;
      const dueDay = card.due_day || 25;

      const today = new Date();
      const currentMonthClosingDate = new Date(today.getFullYear(), today.getMonth(), closingDay, 23, 59, 59, 999);
      const nextMonthClosingDate = new Date(today.getFullYear(), today.getMonth() + 1, closingDay, 23, 59, 59, 999);
      const nextMonthDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);

      if (today > currentMonthClosingDate) {
        currentMonthClosingDate.setMonth(today.getMonth() + 1);
        nextMonthClosingDate.setMonth(today.getMonth() + 2);
        nextMonthDueDate.setMonth(today.getMonth() + 2);
      }

      const transactions = await prisma.transactions.findMany({
        where: {
          user_id: userId,
          entity_id: Number(cardId),
          type: 'expense',
          transaction_date: {
            gt: currentMonthClosingDate,
            lte: nextMonthClosingDate
          },
          deleted_at: null
        },
        include: {
          categories: true,
          purchase_installments: true
        },
        orderBy: {
          transaction_date: 'desc'
        }
      });

      const totalExpenses = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

      res.json({
        card: {
          id: card.id,
          name: card.name,
          color: card.color,
          limit: card.credit_limit,
          closingDay,
          dueDay
        },
        bill: {
          startDate: currentMonthClosingDate,
          endDate: nextMonthClosingDate,
          closingDate: nextMonthClosingDate,
          dueDate: nextMonthDueDate,
          totalExpenses,
          transactionCount: transactions.length,
          transactions: transactions.map(t => ({
            id: t.id,
            description: t.description,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            type: t.type,
            category: t.categories?.name,
            installment_number: t.installment_number,
            installment_id: t.installment_id,
            purchase_installments: t.purchase_installments ? {
              description: t.purchase_installments.description,
              installment_count: t.purchase_installments.installment_count,
              installment_value: Number(t.purchase_installments.installment_value)
            } : null
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
}