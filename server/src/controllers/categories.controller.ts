import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

export class CategoriesController {
  /**
   * Lista todas as categorias do usuário
   */
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const accountId = req.accountId!;
      const { type } = req.query;

      const where: any = { account_id: accountId };
      if (type) where.type = type;

      const categories = await prisma.categories.findMany({
        where,
        orderBy: { name: 'asc' }
      });

      res.json({ categories });
    } catch (error) {
      console.error('❌ Erro no CategoriesController.list:', error);
      next(error);
    }
  }

  /**
   * Cria uma nova categoria
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const accountId = req.accountId!;
      const { name, type, color } = req.body;

      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      // Check if already exists
      const existing = await prisma.categories.findFirst({
        where: {
          account_id: accountId,
          name,
          type
        }
      });

      if (existing) {
        return res.status(409).json({ error: 'Category already exists for this type' });
      }

      const category = await prisma.categories.create({
        data: {
          account_id: accountId,
          name,
          type,
          color: color || '#3b82f6' // Default blue
        }
      });

      res.status(201).json({ category });
    } catch (error) {
      console.error('❌ Erro no CategoriesController.create:', error);
      next(error);
    }
  }

  /**
   * Atualiza uma categoria
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const accountId = req.accountId!;
      const { id } = req.params;
      const { name, color } = req.body;

      const category = await prisma.categories.findUnique({
        where: { id: Number(id) }
      });

      if (!category || category.account_id !== accountId) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const updated = await prisma.categories.update({
        where: { id: Number(id) },
        data: {
          name: name || undefined,
          color: color || undefined
        }
      });

      res.json({ category: updated });
    } catch (error) {
      console.error('❌ Erro no CategoriesController.update:', error);
      next(error);
    }
  }

  /**
   * Remove uma categoria
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const accountId = req.accountId!;
      const { id } = req.params;

      const category = await prisma.categories.findUnique({
        where: { id: Number(id) }
      });

      if (!category || category.account_id !== accountId) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await prisma.categories.delete({
        where: { id: Number(id) }
      });

      res.status(204).send();
    } catch (error) {
      console.error('❌ Erro no CategoriesController.delete:', error);
      next(error);
    }
  }
}
