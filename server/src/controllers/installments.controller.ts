import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import * as installmentsService from '../services/installments.service.js';

interface CreateInstallmentDTO {
  entity_id: number;
  description: string;
  amount: number;
  installment_count: number;
  start_date: string;
  category?: string;
  category_id?: number;
  first_installment?: number;
}

/** Mapeia códigos de erro do service para status HTTP. */
function installmentErrorStatus(code: string): number {
  switch (code) {
    case 'CARD_NOT_FOUND':
    case 'ACCOUNT_NOT_FOUND':
    case 'PURCHASE_NOT_FOUND':
      return 404;
    case 'PURCHASE_ALREADY_CANCELLED':
      return 409;
    default:
      return 400;
  }
}

export class InstallmentsController {
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const dto: CreateInstallmentDTO = req.body;
      const result = await installmentsService.createInstallmentPurchase(userId, dto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(installmentErrorStatus(error?.message)).json({ error: error?.message });
    }
  }

  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { entity_id, status } = req.query;

      const where: any = {
        user_id: userId
      };

      if (entity_id) {
        where.entity_id = Number(entity_id);
      }

      if (status) {
        where.status = status;
      }

      const purchases = await prisma.purchase_installments.findMany({
        where,
        include: {
          financial_entities: true,
          transactions: {
            orderBy: {
              installment_number: 'asc'
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      const purchasesWithDetails = purchases.map(purchase => {
        const paidInstallments = purchase.transactions.filter(t => t.status === 'paid').length;
        const remainingInstallments = purchase.installment_count - paidInstallments;

        return {
          id: purchase.id,
          description: purchase.description,
          amount: Number(purchase.amount),
          installment_count: purchase.installment_count,
          installment_value: Number(purchase.installment_value),
          first_installment: purchase.first_installment,
          start_date: purchase.start_date,
          status: purchase.status,
          card: purchase.financial_entities,
          paid_installments: paidInstallments,
          remaining_installments: remainingInstallments,
          transactions: purchase.transactions.map(t => ({
            id: t.id,
            installment_number: t.installment_number,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            status: t.status,
            description: t.description
          }))
        };
      });

      res.json({ purchases: purchasesWithDetails });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const purchase = await prisma.purchase_installments.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        },
        include: {
          financial_entities: true,
          transactions: {
            orderBy: {
              installment_number: 'asc'
            }
          }
        }
      });

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      const paidInstallments = purchase.transactions.filter(t => t.status === 'paid').length;
      const remainingInstallments = purchase.installment_count - paidInstallments;

      res.json({
        purchase: {
          id: purchase.id,
          description: purchase.description,
          amount: Number(purchase.amount),
          installment_count: purchase.installment_count,
          installment_value: Number(purchase.installment_value),
          first_installment: purchase.first_installment,
          start_date: purchase.start_date,
          status: purchase.status,
          card: purchase.financial_entities,
          paid_installments: paidInstallments,
          remaining_installments: remainingInstallments,
          transactions: purchase.transactions.map(t => ({
            id: t.id,
            installment_number: t.installment_number,
            amount: Number(t.amount),
            transaction_date: t.transaction_date,
            status: t.status,
            description: t.description
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      await installmentsService.cancelInstallmentPurchase(userId, Number(id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(installmentErrorStatus(error?.message)).json({ error: error?.message });
    }
  }

  static async updateStatus(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.userId!;

      if (!['active', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const purchase = await prisma.purchase_installments.findFirst({
        where: {
          id: Number(id),
          user_id: userId
        }
      });

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      const updatedPurchase = await prisma.purchase_installments.update({
        where: { id: Number(id) },
        data: { status }
      });

      res.json({ purchase: updatedPurchase });
    } catch (error) {
      next(error);
    }
  }
}
