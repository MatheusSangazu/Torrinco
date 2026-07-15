import type { Request, Response, NextFunction } from 'express';
import { authenticateJwt, type JwtRequest } from './jwt.js';
import { prisma } from '../lib/prisma.js';

/**
 * Auth dupla para a camada agent-friendly.
 *
 * - JWT (app/PWA): header `Authorization: Bearer <token>` → userId do token.
 * - API key de serviço (n8n/agente): header `x-api-key: <AGENT_API_KEY>` +
 *   `x-user-id: <id>` (alvo) — OBRIGATÓRIO. Sem `x-user-id` a request é
 *   recusada: em multi-conta, chutar um usuário vazaria dados de um cliente
 *   para outro.
 *
 * Em ambos os casos, popula `req.userId` e `req.accountId`.
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

    // Resolve o usuário alvo — x-user-id é obrigatório (sem fallback).
    const headerUserId = req.headers['x-user-id'] as string | undefined;
    if (!headerUserId) {
      return res.status(400).json({ error: 'x-user-id é obrigatório ao usar API key' });
    }
    const userId = Number(headerUserId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'x-user-id inválido' });
    }

    // Carrega conta para popular req.accountId e checar status (isolamento).
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, account_id: true, status: true, accounts: { select: { status: true } } }
    });
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inválido ou inativo' });
    }
    const acctStatus = user.accounts?.status;
    if (acctStatus && acctStatus !== 'active' && acctStatus !== 'trial') {
      return res.status(403).json({ error: 'Conta não está ativa' });
    }

    req.userId = user.id;
    req.accountId = user.account_id;
    return next();
  }

  // Sem API key → cai no fluxo JWT normal do app.
  return authenticateJwt(req, res, next);
}
