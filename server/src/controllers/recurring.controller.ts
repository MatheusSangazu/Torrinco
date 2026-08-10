import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { parseDate, advanceDate, todayUTC, type Frequency } from '../lib/date-utils.js';
import * as recurringService from '../services/recurring.service.js';
import { getCategoryForAccount, getEntityForAccount } from '../services/ownership.service.js';
import { getValidatedBody, getValidatedQuery } from '../middleware/validate.js';

export class RecurringController {
  /**
   * Cria uma nova transação recorrente
   */
  static async createTransaction(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { description, amount, category, category_id, income_source_id, type, frequency, start_date, entity_id, payment_method, idempotency_key } = getValidatedBody<any>(req);
      const userId = req.userId!;

      if (!description || !amount || !type || !frequency || !start_date) {
        return res.status(400).json({
          code: 'REQUIRED_FIELDS', error: 'Descrição, valor, tipo, frequência e data inicial são obrigatórios.'
        });
      }

      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ code: 'INVALID_TYPE', error: 'O tipo deve ser receita ou despesa.' });
      }

      // Validar pertencimento de category_id e entity_id à conta.
      const accountId = req.accountId!;
      if (category_id) {
        const cat = await getCategoryForAccount(Number(category_id), accountId);
        if (!cat) return res.status(403).json({ error: 'Categoria não pertence a esta conta' });
      }
      if (entity_id) {
        const entity = await getEntityForAccount(Number(entity_id), accountId);
        if (!entity) return res.status(403).json({ error: 'Entidade não pertence a esta conta' });
      }
      if (income_source_id) {
        if (type !== 'income') return res.status(400).json({ code: 'INCOME_SOURCE_TYPE_MISMATCH', error: 'Fonte de renda só pode ser usada em receitas.' });
        const source = await prisma.income_sources.findFirst({ where: { id: Number(income_source_id), user_id: userId } });
        if (!source) return res.status(403).json({ code: 'INCOME_SOURCE_FORBIDDEN', error: 'A fonte de renda informada não pertence a este usuário.' });
      }

      const recurringTransaction = await recurringService.createRecurring(userId, {
        description,
        amount: parseFloat(amount),
        type,
        frequency,
        start_date,
        category,
        category_id: category_id ? Number(category_id) : undefined,
        income_source_id: income_source_id ? Number(income_source_id) : undefined,
        entity_id: entity_id ? Number(entity_id) : undefined,
        payment_method,
        idempotency_key,
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
      const { status, type } = getValidatedQuery(req);
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
      const { description, amount, category, category_id, income_source_id, frequency, status, entity_id, payment_method } = req.body;
      const userId = req.userId!;

      const existing = await prisma.recurring_transactions.findFirst({
        where: { id: Number(id), user_id: userId }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Transação recorrente não encontrada.' });
      }

      // Resolver category_id e category name se necessário
      let finalCategoryId = category_id !== undefined ? (category_id ? parseInt(category_id) : null) : undefined;
      let finalCategoryName = category;

      const accountId = req.accountId!;

      // Validar category_id pertence à conta antes de resolver o nome.
      if (finalCategoryId) {
        const cat = await getCategoryForAccount(finalCategoryId, accountId);
        if (!cat) return res.status(403).json({ error: 'Categoria não pertence a esta conta' });
        if (!finalCategoryName) finalCategoryName = cat.name;
      }

      // Validar entity_id se fornecido.
      if (entity_id) {
        const entity = await getEntityForAccount(Number(entity_id), accountId);
        if (!entity) return res.status(403).json({ error: 'Entidade não pertence a esta conta' });
      }
      if (income_source_id) {
        const source=await prisma.income_sources.findFirst({where:{id:Number(income_source_id),user_id:userId}});
        if(!source)return res.status(403).json({code:'INCOME_SOURCE_FORBIDDEN',error:'A fonte de renda informada não pertence a este usuário.'});
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
          income_source_id: income_source_id !== undefined ? (income_source_id ? Number(income_source_id) : null) : undefined,
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
        return res.status(404).json({ error: 'Transação recorrente não encontrada.' });
      }

      await prisma.recurring_transactions.update({
        where: { id: Number(id) },
        data: { status: 'cancelled' }
      });

      res.json({ message: 'Transação recorrente cancelada com sucesso.' });
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
      const notFound=error?.message==='RECURRING_NOT_FOUND';
      res.status(notFound ? 404 : 400).json({ code:notFound?'RECURRING_NOT_FOUND':'RECURRING_GENERATION_FAILED',error:notFound?'Transação recorrente não encontrada.':'Não foi possível gerar a ocorrência recorrente.' });
    }
  }

  /**
   * Lista transações recorrentes próximas do vencimento (delega ao service).
   */
  static async listDue(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { days = 7 } = getValidatedQuery(req);
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
