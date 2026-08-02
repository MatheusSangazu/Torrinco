import { prisma } from '../lib/prisma.js';
import { materializeDue } from './recurring.service.js';
import { syncBillCycle } from './billing.service.js';

/**
 * Orquestra os jobs agendados do servidor.
 *
 * O servidor é autossuficiente: mesmo que o n8n/IA esteja fora, este job roda
 * diariamente e mantém os dados atualizados (recorrências materializadas e
 * faturas com status correto). O agente de IA pode forçar a execução antes de
 * responder via POST /api/recurring/run para ter dados frescos.
 */

/**
 * Materializa as recorrências vencidas de TODOS os usuários ativos.
 * Idempotente: a deduplicação por FK impede duplicação em execuções repetidas.
 */
export async function runRecurringJob() {
  const users = await prisma.users.findMany({
    where: { status: 'active' },
    select: { id: true }
  });

  const summary: { userId: number; created: number }[] = [];
  for (const u of users) {
    try {
      const created = await materializeDue(u.id);
      if (created.length > 0) {
        summary.push({ userId: u.id, created: created.length });
      }
    } catch (err) {
      console.error(`[scheduler] Falha ao materializar recorrências do usuário ${u.id}:`, err);
    }
  }
  return summary;
}

/**
 * Sincroniza o ciclo de faturas de TODOS os cartões ativos: garante a fatura do
 * ciclo atual criada e faturas vencidas marcadas como "closed".
 */
export async function runBillCycleJob() {
  const cards = await prisma.financial_entities.findMany({
    where: { type: 'credit_card' },
    select: { id: true, created_by_user_id: true }
  });

  const summary: { cardId: number; synced: boolean }[] = [];
  for (const c of cards) {
    try {
      // syncBillCycle precisa de um userId; usa created_by_user_id (fallback pra primeiro user da conta).
      const userId = c.created_by_user_id ?? 1;
      await syncBillCycle(c.id, userId);
      summary.push({ cardId: c.id, synced: true });
    } catch (err) {
      console.error(`[scheduler] Falha ao sincronizar faturas do cartão ${c.id}:`, err);
      summary.push({ cardId: c.id, synced: false });
    }
  }
  return summary;
}

/**
 * Executa todos os jobs diários em sequência.
 * Ordem: primeiro materializa recorrências (para que as transações de crédito
 * já existam ao sincronizar as faturas), depois sincroniza o ciclo de faturas.
 */
export async function runDailyJobs() {
  const recurring = await runRecurringJob();
  const bills = await runBillCycleJob();
  return { recurring, bills };
}
