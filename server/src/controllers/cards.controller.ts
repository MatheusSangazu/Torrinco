import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import * as billing from '../services/billing.service.js';
import { assertWithinLimit } from '../services/subscription.service.js';

/** Mapeia códigos de erro do service de billing para status HTTP. */
function billingErrorStatus(code: string): number {
  switch (code) {
    case 'CARD_NOT_FOUND':
    case 'BILL_NOT_FOUND':
    case 'USER_NOT_FOUND':
      return 404;
    case 'BILL_NOT_OPEN':
    case 'BILL_ALREADY_PAID':
    case 'BILL_NOT_PAID':
      return 409;
    default:
      return 400;
  }
}

export class CardsController {
  static async list(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const accountId = req.accountId!;

      const cards = await prisma.financial_entities.findMany({
        where: { account_id: accountId, type: 'credit_card' },
        orderBy: { name: 'asc' }
      });

      // Para cada cartão, usa a fatura atual via billing.service (fonte única).
      // Isso garante o mesmo total exibido na página de detalhe da fatura.
      const cardsWithDetails = await Promise.all(cards.map(async card => {
        // Garante a fatura do ciclo atual (cria se não existir) e sincroniza status.
        const { bill } = await billing.getOrCreateCurrentBill(card.id, userId);
        const details = await billing.getBillDetails(bill.id, userId);
        const total = details.bill.total_amount;

        return {
          id: card.id,
          name: card.name,
          limit: Number(card.credit_limit || 0),
          currentBill: total,
          availableLimit: Number(card.credit_limit || 0) - total,
          closingDay: card.closing_day,
          dueDay: card.due_day,
          periodStart: bill.period_start,
          periodEnd: bill.period_end,
          closingDate: bill.closing_date,
          dueDate: bill.due_date,
          status: bill.status,
          isPaid: bill.status === 'paid',
          paymentId: bill.payment_transaction_id ?? undefined,
          billId: bill.id,
          transactionCount: details.bill.items.length,
          transactions: details.bill.items,
          color: card.color || 'from-purple-600 to-indigo-700',
          isCurrentBill: true
        };
      }));

      res.json({ cards: cardsWithDetails });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo cartão de crédito
   */
  static async create(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { name, limit, closing_day, due_day, color } = req.body;
      const userId = req.userId!;
      const accountId = req.accountId!;

      await assertWithinLimit(accountId, 'cards');

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      // Cartão de crédito sem closing_day/due_day quebra o cálculo de fatura.
      // Antes o sistema aceitava e chutava dia 1/dia 10 silenciosamente.
      const cd = Number(closing_day);
      const dd = Number(due_day);
      if (!Number.isInteger(cd) || cd < 1 || cd > 31) {
        return res.status(400).json({ error: 'closing_day é obrigatório (1-31).' });
      }
      if (!Number.isInteger(dd) || dd < 1 || dd > 31) {
        return res.status(400).json({ error: 'due_day é obrigatório (1-31).' });
      }

      const card = await prisma.financial_entities.create({
        data: {
          account_id: accountId,
          created_by_user_id: userId,
          name,
          type: 'credit_card',
          credit_limit: limit ? parseFloat(limit) : 0,
          closing_day: cd,
          due_day: dd,
          color: color || 'from-purple-600 to-indigo-700',
          // balance é usado para saldo inicial ou acumulado, vamos iniciar com 0
          balance: 0
        }
      });

      res.status(201).json({ card });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um cartão
   */
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, limit, closing_day, due_day, color } = req.body;
      const accountId = req.accountId!;

      // Validar se vieram no update — não pode limpar pra null nem inventar.
      if (closing_day !== undefined) {
        const cd = Number(closing_day);
        if (!Number.isInteger(cd) || cd < 1 || cd > 31) {
          return res.status(400).json({ error: 'closing_day deve ser 1-31.' });
        }
      }
      if (due_day !== undefined) {
        const dd = Number(due_day);
        if (!Number.isInteger(dd) || dd < 1 || dd > 31) {
          return res.status(400).json({ error: 'due_day deve ser 1-31.' });
        }
      }

      const card = await prisma.financial_entities.update({
        where: { id: Number(id), account_id: accountId },
        data: {
          name,
          credit_limit: limit !== undefined ? (limit ? parseFloat(limit) : 0) : undefined,
          closing_day: closing_day !== undefined ? Number(closing_day) : undefined,
          due_day: due_day !== undefined ? Number(due_day) : undefined,
          color: color !== undefined ? color : undefined
        }
      });

      res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  static async getBillHistory(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { months = 6 } = req.query;
      const userId = req.userId!;
      const bills = await billing.getHistory(Number(id), userId, Number(months));
      res.json({ bills });
    } catch (error: any) {
      res.status(billingErrorStatus(error?.message)).json({ error: error?.message });
    }
  }

  /**
   * Remove um cartão
   */
  static async delete(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const accountId = req.accountId!;

      // Verificar se tem transações antes de deletar (opcional, mas seguro)
      const transactions = await prisma.transactions.count({
        where: { entity_id: Number(id), account_id: accountId }
      });

      if (transactions > 0) {
        return res.status(400).json({ error: 'Cannot delete card with transactions' });
      }

      await prisma.financial_entities.delete({
        where: { id: Number(id), account_id: accountId }
      });

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  // --- Faturas (via billing.service — fonte única) ---

  /** Fatura atual (aberta) do cartão. */
  static async getCurrentBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { bill, period } = await billing.getOrCreateCurrentBill(Number(id), userId);
      const details = await billing.getBillDetails(bill.id, userId);
      res.json({ ...details, period });
    } catch (error: any) {
      if (error?.message?.startsWith('CARD_NOT_FOUND') || error?.message?.startsWith('BILL_NOT_FOUND')) {
        return res.status(404).json({ error: 'Not found' });
      }
      next(error);
    }
  }

  /** Fatura por offset (0 atual, -1 anterior, +1 próxima). */
  static async getBillByOffset(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const offset = Number(req.query.offset ?? 0);
      const userId = req.userId!;
      const result = await billing.getBillByOffset(Number(id), userId, offset);
      if (!result.bill) {
        return res.status(404).json({ error: 'Bill not found for this period' });
      }
      const details = await billing.getBillDetails(result.bill.id, userId);
      res.json({ ...details, period: result.period });
    } catch (error: any) {
      res.status(billingErrorStatus(error?.message)).json({ error: error?.message });
    }
  }

  /** Detalhe de uma fatura por id. */
  static async getBillDetails(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { billId } = req.params;
      const userId = req.userId!;
      const details = await billing.getBillDetails(Number(billId), userId);
      res.json(details);
    } catch (error: any) {
      res.status(billingErrorStatus(error?.message)).json({ error: error?.message });
    }
  }

  /** Registra pagamento de uma fatura (cria transação vinculada). */
  static async payBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { billId } = req.params;
      const { payment_method, payment_date } = req.body;
      const userId = req.userId!;
      const paidAt = payment_date ? new Date(payment_date) : undefined;
      const bill = await billing.registerPayment(Number(billId), userId, payment_method ?? 'pix', paidAt);
      res.json({ bill });
    } catch (error: any) {
      res.status(billingErrorStatus(error?.message)).json({ error: error?.message });
    }
  }

  /** Desfaz o pagamento de uma fatura (via FK, não string matching). */
  static async undoBillPayment(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { billId } = req.params;
      const userId = req.userId!;
      const bill = await billing.undoPayment(Number(billId), userId);
      res.json({ bill });
    } catch (error: any) {
      res.status(billingErrorStatus(error?.message)).json({ error: error?.message });
    }
  }
}
