import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { invalidateAccountStatusCache } from '../middleware/jwt.js';
import { auditLog } from '../lib/audit.js';
import { RefreshTokenService } from '../services/refresh-token.service.js';
import { clearRefreshTokenCookie } from '../lib/cookie.js';

/**
 * Exportação completa de dados do usuário (LGPD — art. 18, V: portabilidade).
 *
 * Diferente do export.controller (que exporta só transações para Excel),
 * este endpoint retorna TODOS os dados vinculados ao usuário em JSON:
 * perfil, contas, cartões, transações, faturas, recorrências, parcelamentos,
 * lembretes, eventos e categorias.
 *
 * Objeto único pronto para re-import em outro serviço.
 */
export class UserDataController {
  static async export(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const accountId = req.accountId!;

      const [
        user,
        entities,
        transactions,
        cardBills,
        recurring,
        purchases,
        categories,
        reminders,
        events
      ] = await Promise.all([
        prisma.users.findUnique({
          where: { id: userId },
          select: {
            id: true, name: true, phone_number: true,
            google_email: true, google_calendar_id: true,
            created_at: true, account_id: true
            // Não exportamos: password_hash, refresh_tokens, google_refresh_token.
          }
        }),
        prisma.financial_entities.findMany({ where: { account_id: accountId } }),
        prisma.transactions.findMany({
          where: { user_id: userId, deleted_at: null },
          orderBy: { transaction_date: 'desc' }
        }),
        prisma.card_bills.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } }),
        prisma.recurring_transactions.findMany({ where: { user_id: userId } }),
        prisma.purchase_installments.findMany({ where: { user_id: userId } }),
        prisma.categories.findMany({ where: { account_id: accountId } }),
        prisma.reminders.findMany({ where: { user_id: userId } }),
        prisma.events.findMany({ where: { user_id: userId } })
      ]);

      // Conta vinculada ao usuário (single-account model).
      const account = user?.account_id
        ? await prisma.accounts.findUnique({ where: { id: user.account_id } })
        : null;

      auditLog({
        actor: { kind: 'user', id: userId },
        action: 'user.export_data',
        target: { type: 'user', id: userId }
      });

      const payload = {
        exported_at: new Date().toISOString(),
        formato: 'LGPD_portabilidade_v1',
        usuario: user,
        conta: account,
        entidades: entities,            // cartões + contas bancárias
        transacoes: transactions,
        faturas: cardBills,
        recorrências: recurring,
        parcelamentos: purchases,
        categorias: categories,
        lembretes: reminders,
        eventos_agenda: events
      };

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="torrinco-dados-${userId}-${Date.now()}.json"`
      );
      res.json(payload);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exclusão completa da conta (LGPD — art. 18, VI: eliminação).
   * Soft-delete do usuário + hash do telefone/anonimização dos PII.
   * Transações são retidas por 5 anos por obrigação contábil, mas PII
   * (nome, email, telefone) são anonimizados imediatamente.
   */
  static async deleteAccount(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const accountId = req.accountId!;

      // 1. Busca dados antes de anonimizar (para revogar Google se preciso).
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { google_refresh_token: true, account_id: true }
      });

      // 2. Revoga integração Google (revoke no Google + limpa local).
      if (user?.google_refresh_token) {
        try {
          const { google } = await import('googleapis');
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
          );
          oauth2Client.setCredentials({ refresh_token: user.google_refresh_token });
          await oauth2Client.revokeToken(user.google_refresh_token);
          console.log('✅ [deleteAccount] Token Google revogado');
        } catch (googleErr) {
          console.warn('⚠️ [deleteAccount] Falha ao revogar Google (continuando):', googleErr);
        }
      }

      // 3. Revoga TODAS as sessões (refresh tokens) — impede novos refreshes.
      await RefreshTokenService.revokeAllUserTokens(userId);

      // 4. Anonimiza PII + desativa usuário imediatamente.
      await prisma.users.update({
        where: { id: userId },
        data: {
          name: 'conta_excluida',
          phone_number: `deleted-${userId}`,
          password_hash: null,
          google_refresh_token: null,
          google_email: null,
          google_calendar_id: null,
          status: 'inactive',
        }
      });

      // 5. Cancela a conta — o gate de account_status em authenticateJwt bloqueia
      //    access tokens antigos imediatamente (em até TTL_MS segundos).
      await prisma.accounts.update({
        where: { id: accountId },
        data: { status: 'cancelled' }
      });

      // 6. Invalida cache de autenticação para esta conta (efeito imediato).
      invalidateAccountStatusCache(accountId);

      // 7. Limpa cookie de refresh token.
      clearRefreshTokenCookie(res);

      auditLog({
        actor: { kind: 'user', id: userId },
        action: 'user.delete_account',
        target: { type: 'user', id: userId },
        meta: {
          retention_note: 'PII anonimizado; transações retidas 5 anos por obrigação contábil',
          sessions_revoked: true,
          google_revoked: !!user?.google_refresh_token,
          account_cancelled: true,
        }
      });

      res.json({
        ok: true,
        mensagem: 'Conta excluída. Todas as sessões foram revogadas, a integração Google foi desconectada e seus dados de identificação foram removidos. Transações são mantidas anonimizadas por 5 anos conforme obrigação contábil.'
      });
    } catch (error) {
      next(error);
    }
  }
}
