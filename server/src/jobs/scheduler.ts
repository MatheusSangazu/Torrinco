import cron from 'node-cron';
import { runDailyJobs } from '../services/scheduler.service.js';

/**
 * Registro dos jobs agendados do servidor.
 *
 * Rodam diariamente às 03:00 (hora local do servidor — America/Sao_Paulo).
 * Ordem: recorrências → ciclo de faturas (definido em runDailyJobs).
 *
 * O agente de IA pode forçar execução imediata via POST /api/recurring/run
 * para garantir dados frescos antes de responder.
 */
export function startScheduledJobs() {
  // Diariamente às 03:00.
  cron.schedule('0 3 * * *', async () => {
    console.log('[cron] Iniciando jobs diários...');
    try {
      const result = await runDailyJobs();
      const recCount = result.recurring.reduce((s, r) => s + r.created, 0);
      const billCount = result.bills.filter(b => b.synced).length;
      console.log(`[cron] Jobs concluídos: ${recCount} recorrências materializadas, ${billCount} faturas sincronizadas.`);
    } catch (err) {
      console.error('[cron] Erro nos jobs diários:', err);
    }
  });

  console.log('✅ Jobs agendados registrados (diariamente às 03:00).');
}
