import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';

export class IncomeSourcesController {
  /**
   * Lista todas as fontes de receita do usuário
   */
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const incomeSources = await prisma.income_sources.findMany({
        where: { user_id: userId },
        orderBy: { name: 'asc' }
      });

      res.json({ income_sources: incomeSources });
    } catch (error) {
      console.error('❌ Erro no IncomeSourcesController.list:', error);
      next(error);
    }
  }

  /**
   * Cria uma nova fonte de receita
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { name, color } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      // Check if already exists
      const existing = await prisma.income_sources.findFirst({
        where: {
          user_id: userId,
          name
        }
      });

      if (existing) {
        return res.status(409).json({ error: 'Income source already exists' });
      }

      const incomeSource = await prisma.income_sources.create({
        data: {
          user_id: userId,
          name,
          color: color || '#10b981' // Default green
        }
      });

      res.status(201).json({ income_source: incomeSource });
    } catch (error) {
      console.error('❌ Erro no IncomeSourcesController.create:', error);
      next(error);
    }
  }

  /**
   * Atualiza uma fonte de receita
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { name, color } = req.body;

      const incomeSource = await prisma.income_sources.findUnique({
        where: { id: Number(id) }
      });

      if (!incomeSource || incomeSource.user_id !== userId) {
        return res.status(404).json({ error: 'Income source not found' });
      }

      const updated = await prisma.income_sources.update({
        where: { id: Number(id) },
        data: {
          name: name || undefined,
          color: color || undefined
        }
      });

      res.json({ income_source: updated });
    } catch (error) {
      console.error('❌ Erro no IncomeSourcesController.update:', error);
      next(error);
    }
  }

  /**
   * Remove uma fonte de receita
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const incomeSource = await prisma.income_sources.findUnique({
        where: { id: Number(id) }
      });

      if (!incomeSource || incomeSource.user_id !== userId) {
        return res.status(404).json({ error: 'Income source not found' });
      }

      await prisma.income_sources.delete({
        where: { id: Number(id) }
      });

      res.status(204).send();
    } catch (error) {
      console.error('❌ Erro no IncomeSourcesController.delete:', error);
      next(error);
    }
  }
}
