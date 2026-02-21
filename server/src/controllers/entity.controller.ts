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

      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      const entity = await prisma.financial_entities.create({
        data: {
          user_id: userId,
          name,
          type,
          balance: balance ? parseFloat(balance) : 0,
          credit_limit: credit_limit ? parseFloat(credit_limit) : 0,
          closing_day: closing_day ? parseInt(closing_day) : null,
          due_day: due_day ? parseInt(due_day) : null
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
      const userId = req.userId!;

      const where: any = { user_id: userId };
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
              deleted_at: null
            },
            _sum: {
              amount: true
            }
          });

          const pending_count = await prisma.transactions.count({
            where: {
              entity_id: entity.id,
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
      const userId = req.userId!;

      const entity = await prisma.financial_entities.findFirst({
        where: {
          id: Number(id),
          user_id: userId
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
      const userId = req.userId!;

      const existingEntity = await prisma.financial_entities.findFirst({
        where: { id: Number(id), user_id: userId }
      });

      if (!existingEntity) {
        return res.status(404).json({ error: 'Entity not found' });
      }

      const entity = await prisma.financial_entities.update({
        where: { id: Number(id) },
        data: {
          name: name ?? undefined,
          type: type ?? undefined,
          balance: balance ? parseFloat(balance) : undefined,
          credit_limit: credit_limit ? parseFloat(credit_limit) : undefined,
          closing_day: closing_day ? parseInt(closing_day) : undefined,
          due_day: due_day ? parseInt(due_day) : undefined
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
      const userId = req.userId!;

      const existingEntity = await prisma.financial_entities.findFirst({
        where: { id: Number(id), user_id: userId }
      });

      if (!existingEntity) {
        return res.status(404).json({ error: 'Entity not found' });
      }

      const transactionCount = await prisma.transactions.count({
        where: { entity_id: Number(id) }
      });

      if (transactionCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete entity with existing transactions. Delete transactions first.' 
        });
      }

      await prisma.financial_entities.delete({
        where: { id: Number(id) }
      });

      res.json({ message: 'Entity deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}