import type { Request, Response, NextFunction } from 'express';
import { authenticateJwt, type JwtRequest } from './jwt.js';
import { prisma } from '../lib/prisma.js';

/**
 * Auth dupla para a camada agent-friendly.
 *
 * - JWT (app/PWA): header `Authorization: Bearer <token>` → userId do token.
 * - API key de serviço (n8n/agente): header `x-api-key: <AGENT_API_KEY>` +
 *   `x-user-id: <id>` (alvo). Se `x-user-id` ausente, usa o único usuário
 *   ativo (single-user).
 *
 * Em ambos os casos, popula `req.userId`.
 */
export async function agentAuth(req: JwtRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (apiKey) {
    const expected = process.env.AGENT_API_KEY;
    if (!expected) {
      return res.status(503).json({ error: 'AGENT_API_KEY não configurada no servidor' });
    }
    if (apiKey !== expected) {
      return res.status(401).json({ error: 'API key inválida' });
    }

    // Resolve o usuário alvo.
    const headerUserId = req.headers['x-user-id'] as string | undefined;
    let userId: number;

    if (headerUserId) {
      userId = Number(headerUserId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'x-user-id inválido' });
      }
    } else {
      // Single-user: pega o primeiro usuário ativo.
      const user = await prisma.users.findFirst({ where: { status: 'active' }, select: { id: true } });
      if (!user) {
        return res.status(404).json({ error: 'Nenhum usuário ativo encontrado' });
      }
      userId = user.id;
    }

    req.userId = userId;
    return next();
  }

  // Sem API key → cai no fluxo JWT normal do app.
  return authenticateJwt(req, res, next);
}
