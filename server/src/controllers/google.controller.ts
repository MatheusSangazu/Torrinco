import type { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { prisma } from '../lib/prisma.js';
import { getAuthUrl, exchangeCode, verifyState, isConnected, invalidateClient, disconnectGoogle } from '../services/google/auth.service.js';
import { privacyAudit } from '../services/privacy.service.js';
import type { JwtRequest } from '../middleware/jwt.js';

/**
 * Controller do fluxo OAuth2 do Google.
 *
 * Fluxo:
 *  - GET /connect (JWT)    → redireciona para a tela de consentimento do Google.
 *  - GET /callback         → recebe o código, troca por tokens, salva no banco
 *                            e redireciona para uma página de sucesso.
 *  - GET /status (JWT)     → informa se a agenda está conectada.
 */
export class GoogleController {
  /** Inicia o fluxo OAuth redirecionando para o Google. */
  static connect(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      res.redirect(getAuthUrl(userId));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Callback do Google: troca o código por tokens e grava no banco.
   * O `state` (assinado) carrega o userId — sem depender de sessão.
   */
  static async callback(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.query.code as string | undefined;
      const state = req.query.state as string | undefined;
      const errorParam = req.query.error as string | undefined;

      if (errorParam === 'access_denied') {
        return res.send(renderPage('Autorização cancelada', 'Você não autorizou o acesso à agenda. Nenhum dado foi alterado.'));
      }
      if (!code || !state) {
        return res.status(400).send(renderPage('Erro', 'Parâmetros de callback ausentes.'));
      }

      const userId = verifyState(state);
      if (!userId) {
        return res.status(400).send(renderPage('Erro', 'Estado de autenticação inválido. Tente novamente.'));
      }

      // Troca o código pelos tokens.
      const tokens = await exchangeCode(code);
      if (!tokens.refresh_token) {
        // Acontece quando o usuário reautoriza sem `prompt=consent`. Como usamos
        // prompt=consent, deve vir; mas tratamos por segurança.
        return res.status(400).send(renderPage(
          'Refresh token ausente',
          'Não foi possível obter o token permanente. Desconecte o app na sua conta Google e tente novamente.'
        ));
      }

      // Pega o email da conta Google conectada (userinfo).
      let googleEmail: string | null = null;
      try {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI
        );
        oauth2Client.setCredentials({ access_token: tokens.access_token });
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const info = await oauth2.userinfo.get();
        googleEmail = info.data.email ?? null;
      } catch {
        // Não bloqueia o fluxo se não conseguir ler o email.
      }

      await prisma.users.update({
        where: { id: userId },
        data: {
          google_refresh_token: tokens.refresh_token,
          google_email: googleEmail
        }
      });
      invalidateClient(userId);

      res.send(renderPage(
        'Agenda conectada!',
        `Sua agenda do Google${googleEmail ? ` (${googleEmail})` : ''} foi conectada com sucesso. Você já pode pedir ao Torrinco, no WhatsApp, para agendar eventos.`
      ));
    } catch (error) {
      console.error('[google.callback] erro:', error);
      next(error);
    }
  }

  /** Indica se o usuário já conectou a agenda. */
  static async status(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const connected = await isConnected(userId);
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { google_email: true }
      });
      res.json({ connected, email: user?.google_email ?? null });
    } catch (error) {
      next(error);
    }
  }
  static async disconnect(req:JwtRequest,res:Response,next:NextFunction){try{const result=await disconnectGoogle(req.userId!);await privacyAudit({userId:req.userId,accountId:req.accountId,eventType:'integration.google.disconnect',targetType:'google_calendar',outcome:'succeeded',metadata:{remoteRevocationConfirmed:result.revoked}});res.json({ok:true,...result})}catch(error){next(error)}}
}

/** Página HTML simples e auto-contida para as telas de sucesso/erro do callback. */
function renderPage(titulo: string, mensagem: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Torrinco — ${titulo}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: #1e293b; padding: 2.5rem; border-radius: 16px; max-width: 420px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
    .check { font-size: 3rem; margin-bottom: .5rem; }
    h1 { font-size: 1.5rem; margin: .5rem 0 1rem; color: #22c55e; }
    p { line-height: 1.5; color: #cbd5e1; }
    .hint { margin-top: 1.5rem; font-size: .85rem; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✅</div>
    <h1>${titulo}</h1>
    <p>${mensagem}</p>
    <p class="hint">Você pode fechar esta aba.</p>
  </div>
</body>
</html>`;
}
