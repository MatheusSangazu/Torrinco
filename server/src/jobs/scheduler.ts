import cron from 'node-cron';
import { runDailyJobs } from '../services/scheduler.service.js';
import { EvolutionService } from '../services/evolution.service.js';
import { prisma } from '../lib/prisma.js';

/**
 * Registro dos jobs agendados do servidor.
 *
 * - A cada minuto: dispara lembretes que chegaram na hora.
 * - Diariamente às 03:00: materializa recorrências e sincroniza faturas.
 */
export function startScheduledJobs() {
  // A cada minuto — checa lembretes prontos para disparar.
  cron.schedule('* * * * *', async () => {
    await checkReminders();
  });

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

  console.log('✅ Jobs agendados registrados (lembretes a cada min, recorrências às 03:00).');
}

/**
 * Checa lembretes ativos cujo trigger_time chegou e dispara no WPP.
 * Marca os "once" como fired após disparar; recálcula o próximo trigger para recorrentes.
 */
async function checkReminders() {
  const now = new Date();
  // Janela de 1 minuto (evita disparar o mesmo lembrete várias vezes).
  const windowStart = new Date(now.getTime() - 60_000);

  try {
    const due = await prisma.reminders.findMany({
      where: {
        status: 'active',
        trigger_time: { lte: now, gte: windowStart }
      },
      include: {
        users: { select: { phone_number: true, name: true } }
      }
    });

    for (const reminder of due) {
      const phone = reminder.users?.phone_number;
      if (!phone) continue;

      const msg = `⏰ *Lembrete:* ${reminder.content}`;
      await EvolutionService.sendText(phone, msg);

      // once → marca como completed (não repete).
      // daily/weekly/monthly → recálcula o próximo trigger.
      if (reminder.frequency === 'once') {
        await prisma.reminders.update({
          where: { id: reminder.id },
          data: { status: 'completed' }
        });
      } else if (reminder.frequency) {
        const next = calculateNextTrigger(reminder.frequency, reminder.trigger_time);
        if (next) {
          await prisma.reminders.update({
            where: { id: reminder.id },
            data: { trigger_time: next }
          });
        }
      }

      console.log(`[cron] Lembrete ${reminder.id} disparado para ${phone}: ${reminder.content}`);
    }
  } catch (err) {
    // Silencioso — não pode derrubar o servidor.
    console.error('[cron] Erro ao checar lembretes:', err);
  }
}

/** Calcula o próximo trigger com base na frequência. */
function calculateNextTrigger(frequency: string, current: Date): Date | null {
  const next = new Date(current);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      return next;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      return next;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      return next;
    default:
      return null;
  }
}
