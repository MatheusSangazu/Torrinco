import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { addMonths } from '../lib/date-utils.js';
import { projectRecurringTransactions } from '../lib/transaction-projection.js';

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
          transaction_date: transaction_date ? new Date(transaction_date) : undefined,
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
      let userId = req.userId!;
      const { period, target_user_id } = req.query;

      // Se for admin e enviar target_user_id, usa o ID do alvo
      if (req.userRole === 'admin' && target_user_id) {
        userId = Number(target_user_id);
      }
      
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
        totalIncomeUntilNow,
        totalExpenseCashUntilNow,
        realTransactionsForPeriod,
        recurringTransactions
      ] = await Promise.all([
        // Receitas do mês para o resumo
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'income',
            transaction_date: dateFilter,
            deleted_at: null
          },
          _sum: { amount: true }
        }),
        // Despesas do mês para o resumo (exceto pagamento de cartão)
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            transaction_date: dateFilter,
            deleted_at: null,
            category: { not: 'Pagamento de Cartão' }
          },
          _sum: { amount: true }
        }),
        // Saldo Acumulado: Todas as receitas em dinheiro/pix/débito até hoje
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'income',
            payment_method: { in: ['cash', 'pix', 'debit'] },
            transaction_date: { lte: now },
            deleted_at: null
          },
          _sum: { amount: true }
        }),
        // Saldo Acumulado: Todas as despesas em dinheiro/pix/débito até hoje
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            payment_method: { in: ['cash', 'pix', 'debit'] },
            transaction_date: { lte: now },
            deleted_at: null
          },
          _sum: { amount: true }
        }),
        // Buscar transações reais do período para evitar duplicidade com recorrências
        prisma.transactions.findMany({
          where: {
            user_id: userId,
            transaction_date: dateFilter,
            deleted_at: null
          }
        }),
        // Buscar recorrências ativas
        prisma.recurring_transactions.findMany({
          where: {
            user_id: userId,
            status: 'active'
          }
        })
      ]);

      // Projetar recorrências para o período do resumo (apenas para planejamento)
      let recurringIncomeTotal = 0;
      let recurringExpenseTotal = 0;

      if (dateFilter && dateFilter.gte && dateFilter.lte) {
        const projections = projectRecurringTransactions(
          recurringTransactions,
          dateFilter.gte,
          dateFilter.lte,
          realTransactionsForPeriod
        );

        recurringIncomeTotal = projections
          .filter(p => p.type === 'income')
          .reduce((sum, p) => sum + Number(p.amount), 0);
        
        recurringExpenseTotal = projections
          .filter(p => p.type === 'expense')
          .reduce((sum, p) => sum + Number(p.amount), 0);
      }

      const totalIncomePeriod = (Number(income._sum.amount) || 0) + recurringIncomeTotal;
      const totalExpensePeriod = (Number(expense._sum.amount) || 0) + recurringExpenseTotal;
      const cashBalance = (Number(totalIncomeUntilNow._sum.amount) || 0) - (Number(totalExpenseCashUntilNow._sum.amount) || 0);

      res.json({
        month_summary: {
          income: totalIncomePeriod,
          expense: totalExpensePeriod,
          balance: totalIncomePeriod - totalExpensePeriod,
          cash_balance: cashBalance
        }
      });
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

      const today = new Date();
      let forecastStart: Date;
      let forecastEnd: Date;

      if (period === 'next_month') {
        forecastStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        forecastEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      } else {
        forecastStart = new Date(today.getFullYear(), today.getMonth(), 1);
        forecastEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }
      
      forecastStart.setHours(0, 0, 0, 0);
      forecastEnd.setHours(23, 59, 59, 999);

      const creditCards = await prisma.financial_entities.findMany({
        where: {
          user_id: userId,
          type: 'credit_card'
        },
        select: {
          id: true,
          name: true,
          color: true,
          closing_day: true,
          due_day: true,
          credit_limit: true
        }
      });

      let creditCardBillExpenses = 0;
      const creditCardBillTransactions: any[] = [];

      const recurringTransactionsForBill = await prisma.recurring_transactions.findMany({
        where: {
          user_id: userId,
          status: 'active',
          payment_method: 'credit'
        }
      });

      for (const card of creditCards) {
        const closingDay = card.closing_day || 15;
        const dueDay = card.due_day || 25;

        // Determinar qual fatura vence no período do forecast
        // Uma fatura que vence em Março (dueDay) geralmente fecha em Fevereiro (closingDay)
        // O período de compras dela é de Janeiro (closingDay + 1) até Fevereiro (closingDay)
        
        let billDueDate = new Date(forecastStart.getFullYear(), forecastStart.getMonth(), dueDay);
        
        // Se o dueDay for menor que o closingDay, a fatura fecha no mês anterior ao vencimento
        // Se o dueDay for maior ou igual ao closingDay, a fatura fecha no mesmo mês do vencimento (raro, mas possível)
        let billEndDate: Date;
        if (dueDay < closingDay) {
          billEndDate = new Date(billDueDate.getFullYear(), billDueDate.getMonth() - 1, closingDay, 23, 59, 59, 999);
        } else {
          billEndDate = new Date(billDueDate.getFullYear(), billDueDate.getMonth(), closingDay, 23, 59, 59, 999);
        }
        
        const billStartDate = new Date(billEndDate.getFullYear(), billEndDate.getMonth() - 1, closingDay + 1, 0, 0, 0, 0);

        const cardTransactions = await prisma.transactions.findMany({
          where: {
            user_id: userId,
            entity_id: card.id,
            type: 'expense',
            transaction_date: {
              gte: billStartDate,
              lte: billEndDate
            },
            deleted_at: null
          },
          select: {
            description: true,
            amount: true,
            transaction_date: true,
            is_recurring: true
          }
        });

        // Adicionar recorrências projetadas para o cartão
        const projectedRecs = FinanceController.projectRecurringTransactions(
          recurringTransactionsForBill.filter(rt => rt.entity_id === card.id),
          billStartDate,
          billEndDate,
          cardTransactions
        );

        const allCardTransactions = [
          ...cardTransactions.map(t => ({
            description: t.description,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            card_name: card.name,
            card_color: card.color,
            type: 'credit_card_bill' as const
          })),
          ...projectedRecs.map(t => ({
            description: t.description,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            card_name: card.name,
            card_color: card.color,
            type: 'credit_card_bill' as const,
            is_projected: true
          }))
        ];

        const cardTotal = allCardTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        
        // Verificar se já existe um pagamento registrado para esta fatura no forecast
        const paymentExists = await prisma.transactions.findFirst({
          where: {
            user_id: userId,
            type: 'expense',
            category: 'Pagamento de Cartão',
            description: { contains: card.name },
            deleted_at: null,
            transaction_date: {
              gte: new Date(billStartDate.getTime() - 86400000 * 5),
              lte: new Date(billDueDate.getTime() + 86400000 * 10)
            }
          }
        });

        const isPaid = !!paymentExists;

        creditCardBillExpenses += isPaid ? 0 : cardTotal; // Se já pagou, não conta como despesa pendente no forecast
        
        creditCardBillTransactions.push(...allCardTransactions.map(t => ({
          ...t,
          card_id: card.id,
          due_date: billDueDate,
          is_paid: isPaid,
          payment_id: paymentExists?.id
        })));
      }

      const [recurringIncome, recurringExpenses, normalIncome, normalExpenses, installmentsExpenses] = await Promise.all([
        prisma.recurring_transactions.aggregate({
          where: {
            user_id: userId,
            type: 'income',
            status: 'active',
            next_due_date: {
              gte: forecastStart,
              lte: forecastEnd
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
            payment_method: { not: 'credit' }, // Não contar recorrências no crédito aqui, já contadas na fatura
            next_due_date: {
              gte: forecastStart,
              lte: forecastEnd
            }
          },
          _sum: { amount: true },
          _count: true
        }),
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'income',
            transaction_date: {
              gte: forecastStart,
              lte: forecastEnd
            },
            deleted_at: null
          },
          _sum: { amount: true },
          _count: true
        }),
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            transaction_date: {
              gte: forecastStart,
              lte: forecastEnd
            },
            deleted_at: null,
            installment_id: null,
            category: { not: 'Pagamento de Cartão' },
            payment_method: {
              notIn: ['credit', 'credit_card']
            }
          },
          _sum: { amount: true },
          _count: true
        }),
        prisma.transactions.aggregate({
          where: {
            user_id: userId,
            type: 'expense',
            transaction_date: {
              gte: forecastStart,
              lte: forecastEnd
            },
            deleted_at: null,
            installment_id: {
              not: null
            },
            payment_method: {
              notIn: ['credit', 'credit_card']
            }
          },
          _sum: { amount: true },
          _count: true
        })
      ]);

      const forecastIncomeTotal = (Number(recurringIncome._sum.amount) || 0) + (Number(normalIncome._sum.amount) || 0);
      const forecastExpensesTotal = (Number(recurringExpenses._sum.amount) || 0) + (Number(normalExpenses._sum.amount) || 0) + (Number(installmentsExpenses._sum.amount) || 0) + creditCardBillExpenses;
      const forecastBalance = forecastIncomeTotal - forecastExpensesTotal;

      const [recurringIncomeList, recurringExpenseList, normalIncomeList, normalExpensesList, installmentsList] = await Promise.all([
        prisma.recurring_transactions.findMany({
          where: {
            user_id: userId,
            type: 'income',
            status: 'active',
            next_due_date: {
              gte: forecastStart,
              lte: forecastEnd
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
            payment_method: { not: 'credit' },
            next_due_date: {
              gte: forecastStart,
              lte: forecastEnd
            }
          },
          select: {
            description: true,
            amount: true,
            next_due_date: true
          }
        }),
        prisma.transactions.findMany({
          where: {
            user_id: userId,
            type: 'income',
            transaction_date: {
              gte: forecastStart,
              lte: forecastEnd
            },
            deleted_at: null
          },
          select: {
            description: true,
            amount: true,
            transaction_date: true
          }
        }),
        prisma.transactions.findMany({
          where: {
            user_id: userId,
            type: 'expense',
            transaction_date: {
              gte: forecastStart,
              lte: forecastEnd
            },
            deleted_at: null,
            installment_id: null,
            category: { not: 'Pagamento de Cartão' },
            payment_method: {
              notIn: ['credit', 'credit_card']
            }
          },
          select: {
            description: true,
            amount: true,
            transaction_date: true
          }
        }),
        prisma.transactions.findMany({
          where: {
            user_id: userId,
            type: 'expense',
            transaction_date: {
              gte: forecastStart,
              lte: forecastEnd
            },
            deleted_at: null,
            installment_id: {
              not: null
            },
            payment_method: {
              notIn: ['credit', 'credit_card']
            }
          },
          select: {
            description: true,
            amount: true,
            transaction_date: true,
            installment_number: true
          }
        })
      ]);

      res.json({
        period: period === 'next_month' ? 'Próximo Mês' : 'Mês Atual',
        forecast: {
          income: forecastIncomeTotal,
          expenses: forecastExpensesTotal,
          balance: forecastBalance,
          breakdown: {
            recurring_income: recurringIncomeList,
            normal_income: normalIncomeList,
            recurring_expenses: recurringExpenseList,
            normal_expenses: normalExpensesList,
            installments: installmentsList,
            credit_card_bills: creditCardBillTransactions
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

      // Adicionar recorrências projetadas para o cartão
      const recurringTransactions = await prisma.recurring_transactions.findMany({
        where: {
          user_id: userId,
          status: 'active',
          payment_method: 'credit',
          entity_id: Number(cardId)
        },
        include: {
          categories: true
        }
      });

      const projectedRecs = projectRecurringTransactions(
        recurringTransactions,
        previousMonthClosingDate,
        currentMonthClosingDate,
        transactions
      );

      const allTransactions = [
        ...transactions.map(t => ({
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
        })),
        ...projectedRecs.map(pr => ({
          id: pr.id,
          description: pr.description,
          amount: Number(pr.amount),
          transaction_date: pr.transaction_date,
          type: pr.type,
          category: pr.categories?.name || pr.category,
          is_projected: true
        }))
      ];

      const totalExpenses = allTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

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
        new Date(paymentExists.transaction_date) >= new Date(previousMonthClosingDate.getTime() - 86400000) &&
        new Date(paymentExists.transaction_date) <= new Date(dueDate.getTime() + 86400000);

      res.json({
        card: {
          id: card.id,
          name: card.name,
          color: card.color,
          limit: card.credit_limit,
          closingDay,
          dueDay,
          availableLimit: Number(card.credit_limit) - totalExpenses
        },
        bill: {
          startDate: previousMonthClosingDate,
          endDate: currentMonthClosingDate,
          closingDate: currentMonthClosingDate,
          dueDate,
          totalExpenses,
          transactionCount: allTransactions.length,
          transactions: allTransactions,
          status: isPaid ? 'paid' : (today > currentMonthClosingDate ? 'closed' : 'open'),
          isPaid: !!isPaid,
          paymentId: isPaid ? paymentExists.id : undefined
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

      // Adicionar recorrências projetadas para o cartão
      const recurringTransactions = await prisma.recurring_transactions.findMany({
        where: {
          user_id: userId,
          status: 'active',
          payment_method: 'credit',
          entity_id: Number(cardId)
        },
        include: {
          categories: true
        }
      });

      const projectedRecs = projectRecurringTransactions(
        recurringTransactions,
        currentMonthClosingDate,
        nextMonthClosingDate,
        transactions
      );

      const allTransactions = [
        ...transactions.map(t => ({
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
        })),
        ...projectedRecs.map(pr => ({
          id: pr.id,
          description: pr.description,
          amount: Number(pr.amount),
          transaction_date: pr.transaction_date,
          type: pr.type,
          category: pr.categories?.name || pr.category,
          is_projected: true
        }))
      ];

      const totalExpenses = allTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

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
          transactionCount: allTransactions.length,
          transactions: allTransactions
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCardPreviousBill(req: JwtRequest, res: Response, next: NextFunction) {
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
      // Fatura atual (período de fechamento anterior até fechamento atual)
      let currentMonthClosingDate = new Date(today.getFullYear(), today.getMonth(), closingDay, 23, 59, 59, 999);
      let previousMonthClosingDate = new Date(today.getFullYear(), today.getMonth() - 1, closingDay + 1, 0, 0, 0, 0);

      if (today > currentMonthClosingDate) {
        previousMonthClosingDate.setMonth(today.getMonth());
        previousMonthClosingDate.setDate(closingDay + 1);
        currentMonthClosingDate.setMonth(today.getMonth() + 1);
      }

      // Fatura anterior é um mês antes da atual
      const billEndDate = new Date(previousMonthClosingDate.getTime() - 1);
      const billStartDate = new Date(billEndDate.getFullYear(), billEndDate.getMonth() - 1, closingDay + 1, 0, 0, 0, 0);
      const dueDate = new Date(billEndDate.getFullYear(), billEndDate.getMonth(), dueDay);

      const transactions = await prisma.transactions.findMany({
        where: {
          user_id: userId,
          entity_id: Number(cardId),
          type: 'expense',
          transaction_date: {
            gte: billStartDate,
            lte: billEndDate
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

      // Adicionar recorrências projetadas para o cartão
      const recurringTransactions = await prisma.recurring_transactions.findMany({
        where: {
          user_id: userId,
          status: 'active',
          payment_method: 'credit',
          entity_id: Number(cardId)
        },
        include: {
          categories: true
        }
      });

      const projectedRecs = projectRecurringTransactions(
        recurringTransactions,
        billStartDate,
        billEndDate,
        transactions
      );

      const allTransactions = [
        ...transactions.map(t => ({
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
        })),
        ...projectedRecs.map(pr => ({
          id: pr.id,
          description: pr.description,
          amount: Number(pr.amount),
          transaction_date: pr.transaction_date,
          type: pr.type,
          category: pr.categories?.name || pr.category,
          is_projected: true
        }))
      ];

      const totalExpenses = allTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

      const paymentExists = await prisma.transactions.findFirst({
        where: {
          user_id: userId,
          type: 'expense',
          category: 'Pagamento de Cartão',
          description: { contains: card.name },
          deleted_at: null,
          transaction_date: {
            gte: new Date(billStartDate.getTime() - 86400000 * 5),
            lte: new Date(dueDate.getTime() + 86400000 * 10)
          }
        }
      });

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
          startDate: billStartDate,
          endDate: billEndDate,
          closingDate: billEndDate,
          dueDate,
          totalExpenses,
          transactionCount: allTransactions.length,
          transactions: allTransactions,
          status: paymentExists ? 'paid' : 'closed',
          isPaid: !!paymentExists,
          paymentId: paymentExists ? paymentExists.id : undefined
        }
      });
    } catch (error) {
      next(error);
    }
  }
}