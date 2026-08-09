import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

export class EntityController {
  /**
   * Cria uma nova entidade financeira
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const { name, type, balance, credit_limit, closing_day, due_day } = req.body;
      const userId = req.userId!;
      const accountId = req.accountId!;

      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      // Cartões de crédito PRECISAM de closing_day e due_day — sem isso a
      // lógica de fatura não tem como calcular o ciclo e acaba inventando
      // valores (bug antigo de fallback pra dia 1/10).
      if (type === 'credit_card') {
        const cd = Number(closing_day);
        const dd = Number(due_day);
        if (!Number.isInteger(cd) || cd < 1 || cd > 31) {
          return res.status(400).json({ error: 'Cartão de crédito exige closing_day (1-31).' });
        }
        if (!Number.isInteger(dd) || dd < 1 || dd > 31) {
          return res.status(400).json({ error: 'Cartão de crédito exige due_day (1-31).' });
        }
      }

      const entity = await prisma.financial_entities.create({
        data: {
          account_id: accountId,
          created_by_user_id: userId,
          name,
          type,
          balance: balance ? parseFloat(balance) : 0,
          credit_limit: credit_limit ? parseFloat(credit_limit) : 0,
          closing_day: type === 'credit_card' ? Number(closing_day) : (closing_day ? Number(closing_day) : null),
          due_day: type === 'credit_card' ? Number(due_day) : (due_day ? Number(due_day) : null)
        }
      });

      res.status(201).json({ entity });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista todas as entidades do usuário
   */
  static async list(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const { type } = req.query;
      const accountId = req.accountId!;

      const where: any = { account_id: accountId };
      if (type) where.type = type;

      const entities = await prisma.financial_entities.findMany({
        where,
        include: {
          _count: {
            select: { transactions: true }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      const entitiesWithBalance = await Promise.all(
        entities.map(async (entity: any) => {
          const balance = await prisma.transactions.aggregate({
            where: {
              entity_id: entity.id,
              account_id: accountId,
              deleted_at: null
            },
            _sum: {
              amount: true
            }
          });

          const pending_count = await prisma.transactions.count({
            where: {
              entity_id: entity.id,
              account_id: accountId,
              type: 'expense',
              status: 'pending',
              deleted_at: null
            }
          });

          return {
            ...entity,
            current_balance: balance._sum.amount ? parseFloat(balance._sum.amount.toString()) : 0,
            pending_transactions: pending_count
          };
        })
      );

      res.json({ entities: entitiesWithBalance });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém uma entidade específica
   */
  static async getById(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const accountId = req.accountId!;

      const entity = await prisma.financial_entities.findFirst({
        where: {
          id: Number(id),
          account_id: accountId
        },
        include: {
          transactions: {
            take: 10,
            orderBy: { transaction_date: 'desc' }
          }
        }
      });

      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }

      res.json({ entity });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza uma entidade
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const { name, type, balance, credit_limit, closing_day, due_day } = req.body;
      const accountId = req.accountId!;

      const existingEntity = await prisma.financial_entities.findFirst({
        where: { id: Number(id), account_id: accountId }
      });

      if (!existingEntity) {
        return res.status(404).json({ error: 'Entity not found' });
      }

      // Tipo final após update (type pode não vir, usa o existente).
      const finalType = type ?? existingEntity.type;
      if (finalType === 'credit_card') {
        const cd = closing_day !== undefined ? Number(closing_day) : existingEntity.closing_day;
        const dd = due_day !== undefined ? Number(due_day) : existingEntity.due_day;
        if (cd == null || !Number.isInteger(cd) || cd < 1 || cd > 31) {
          return res.status(400).json({ error: 'Cartão de crédito exige closing_day (1-31).' });
        }
        if (dd == null || !Number.isInteger(dd) || dd < 1 || dd > 31) {
          return res.status(400).json({ error: 'Cartão de crédito exige due_day (1-31).' });
        }
      }

      const entity = await prisma.financial_entities.update({
        where: { id: Number(id), account_id: accountId },
        data: {
          name: name ?? undefined,
          type: type ?? undefined,
          balance: balance ? parseFloat(balance) : undefined,
          credit_limit: credit_limit ? parseFloat(credit_limit) : undefined,
          closing_day: closing_day !== undefined ? (closing_day ? Number(closing_day) : null) : undefined,
          due_day: due_day !== undefined ? (due_day ? Number(due_day) : null) : undefined
        }
      });

      res.json({ entity });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove uma entidade
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const accountId = req.accountId!;

      const existingEntity = await prisma.financial_entities.findFirst({
        where: { id: Number(id), account_id: accountId }
      });

      if (!existingEntity) {
        return res.status(404).json({ error: 'Entity not found' });
      }

      const transactionCount = await prisma.transactions.count({
        where: { entity_id: Number(id), account_id: accountId }
      });

      if (transactionCount > 0) {
        return res.status(400).json({
          error: 'Cannot delete entity with existing transactions. Delete transactions first.'
        });
      }

      await prisma.financial_entities.delete({
        where: { id: Number(id), account_id: accountId }
      });

      res.json({ message: 'Entity deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
