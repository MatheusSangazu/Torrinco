import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
import * as agent from '../services/agent.service.js';
import { getValidatedQuery } from '../middleware/validate.js';

/**
 * Controller casca fina: mapeia intents HTTP → agent.service.
 * O agente de IA (FASE 8) chama os services diretamente; estes endpoints
 * servem para integrações externas, testes isolados e spec OpenAPI.
 */
export class AgentController {
  static async expense(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const result = await agent.registerExpense(req.userId!, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error?.message });
    }
  }

  static async income(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const result = await agent.registerIncome(req.userId!, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error?.message });
    }
  }

  static async balance(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const result = await agent.getBalance(req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error?.message });
    }
  }

  static async forecast(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const result = await agent.getForecastForAgent(req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error?.message });
    }
  }

  static async upcoming(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const result = await agent.getUpcoming(req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error?.message });
    }
  }

  static async cardBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { card_name } = getValidatedQuery(req);
      if (!card_name) return res.status(400).json({ error: 'card_name é obrigatório' });
      const result = await agent.getCardBill(req.userId!, String(card_name));
      res.json(result);
    } catch (error: any) {
      res.status(error?.message?.startsWith('Cartão') ? 404 : 400).json({ error: error?.message });
    }
  }

  static async payBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { card_name, payment_method } = req.body;
      if (!card_name) return res.status(400).json({ error: 'card_name é obrigatório' });
      const result = await agent.payCardBill(req.userId!, String(card_name), payment_method ?? 'pix');
      res.json(result);
    } catch (error: any) {
      res.status(error?.message?.startsWith('Cartão') ? 404 : 400).json({ error: error?.message });
    }
  }

  static async undoBill(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { card_name } = req.body;
      if (!card_name) return res.status(400).json({ error: 'card_name é obrigatório' });
      const result = await agent.undoCardBill(req.userId!, String(card_name));
      res.json(result);
    } catch (error: any) {
      res.status(error?.message?.startsWith('Cartão') ? 404 : 400).json({ error: error?.message });
    }
  }

  static async refresh(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const result = await agent.refreshDue(req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error?.message });
    }
  }

  static async cardHistory(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { card_name, months } = getValidatedQuery(req);
      if (!card_name) return res.status(400).json({ error: 'card_name é obrigatório' });
      const result = await agent.getCardHistory(req.userId!, String(card_name), Number(months ?? 6));
      res.json(result);
    } catch (error: any) {
      res.status(error?.message?.startsWith('Cartão') ? 404 : 400).json({ error: error?.message });
    }
  }
}
