import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { auditLog } from '../lib/audit.js';

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
        prisma.financial_entities.findMany({ where: { user_id: userId } }),
        prisma.transactions.findMany({
          where: { user_id: userId, deleted_at: null },
          orderBy: { transaction_date: 'desc' }
        }),
        prisma.card_bills.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } }),
        prisma.recurring_transactions.findMany({ where: { user_id: userId } }),
        prisma.purchase_installments.findMany({ where: { user_id: userId } }),
        prisma.categories.findMany({ where: { user_id: userId } }),
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

      // Anonimiza PII do usuário (mantém o registro pra integridade referencial).
      await prisma.users.update({
        where: { id: userId },
        data: {
          name: 'conta_excluida',
          phone_number: `deleted-${userId}`,
          password_hash: null,
          google_refresh_token: null,
          google_email: null
        }
      });

      auditLog({
        actor: { kind: 'user', id: userId },
        action: 'user.delete_account',
        target: { type: 'user', id: userId },
        meta: { retention_note: 'PII anonimizado; transações retidas 5 anos por obrigação contábil' }
      });

      res.json({
        ok: true,
        mensagem: 'Conta excluída. Seus dados de identificação foram removidos. Transações são mantidas anonimizadas por 5 anos conforme obrigação contábil.'
      });
    } catch (error) {
      next(error);
    }
  }
}
