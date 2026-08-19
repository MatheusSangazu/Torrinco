import cron from 'node-cron';
import { runDailyJobs } from '../services/scheduler.service.js';
import { prisma } from '../lib/prisma.js';
import { isConnected } from '../services/google/auth.service.js';
import { listEvents } from '../services/google/calendar.service.js';
import { dayExecutionKey, markSchedulerStarted, minuteExecutionKey, runIdempotentJob } from '../services/job-runtime.service.js';
import { enqueueReminder, processReminderQueue } from '../services/reminder-delivery.service.js';
import { DEFAULT_ACCOUNT_TIMEZONE, isReminderDue, reminderOccurrenceKey } from '../lib/reminder-time.js';
import { enqueueDueCardBillReminders } from '../services/card-bill-reminder.service.js';

/**
 * Registro dos jobs agendados do servidor.
 *
 * - A cada minuto: dispara lembretes internos + lembretes de eventos do Google.
 * - 07:00 (SP): envia a agenda do dia para quem tem Google conectado.
 * - 03:00: materializa recorrências e sincroniza faturas.
 */
export function startScheduledJobs() {
  markSchedulerStarted();
  // A cada minuto — checa lembretes internos prontos para disparar.
  cron.schedule('* * * * *', async () => {
    const key = minuteExecutionKey();
    await runIdempotentJob('reminder_tick', key, async () => {
      await checkReminders();
      await checkCalendarEventReminders();
      await enqueueDueCardBillReminders();
      return processReminderQueue();
    }).catch(() => undefined);
  });

  // 07:00 horário de SP — agenda do dia (somente se o usuário tem eventos).
  cron.schedule('0 7 * * *', async () => {
    await runIdempotentJob('daily_agenda', dayExecutionKey(new Date(), DEFAULT_ACCOUNT_TIMEZONE), sendDailyAgenda, 10 * 60_000).catch(() => undefined);
  }, { timezone: DEFAULT_ACCOUNT_TIMEZONE });

  // Diariamente às 03:00.
  cron.schedule('0 3 * * *', async () => {
    console.log('[cron] Iniciando jobs diários...');
    try {
      const execution = await runIdempotentJob('daily_maintenance', dayExecutionKey(new Date(), DEFAULT_ACCOUNT_TIMEZONE), runDailyJobs, 30 * 60_000);
      if (!execution.executed || !execution.result) return;
      const result = execution.result;
      const recCount = result.recurring.reduce((s, r) => s + r.created, 0);
      const billCount = result.bills.filter(b => b.synced).length;
      console.log(`[cron] Jobs concluídos: ${recCount} recorrências materializadas, ${billCount} faturas sincronizadas.`);
    } catch (err) {
      console.error('[cron] Erro nos jobs diários:', err);
    }
  }, { timezone: DEFAULT_ACCOUNT_TIMEZONE });

  console.log('✅ Jobs agendados registrados (lembretes a cada min, agenda às 07:00, recorrências às 03:00).');
}

/**
 * Checa lembretes ativos cujo trigger_time chegou e dispara no WPP.
 * Marca os lembretes pontuais como concluídos; recorrentes permanecem ativos.
 */
async function checkReminders() {
  const now = new Date();

  try {
    const due = await prisma.reminders.findMany({
      where: {
        status: 'active'
      },
      include: {
        users: { select: { id: true, account_id: true, status: true, phone_number: true, name: true } }
      }
    });

    for (const reminder of due) {
      if (!isReminderDue(reminder, now, DEFAULT_ACCOUNT_TIMEZONE)) continue;
      const phone = reminder.users?.phone_number;
      if (!phone || reminder.users.status !== 'active') continue;

      const msg = `⏰ *Lembrete:* ${reminder.content}`;
      await enqueueReminder({ sourceType: 'internal', sourceId: String(reminder.id), occurrenceKey: reminderOccurrenceKey(reminder, now), accountId: reminder.users.account_id, userId: reminder.users.id, destination: phone, message: msg });

      // once → marca como completed (não repete).
      // Recorrentes mantêm o horário local; a chave de ocorrência evita duplicidade.
      if (reminder.frequency === 'once') {
        await prisma.reminders.update({
          where: { id: reminder.id },
          data: { status: 'completed' }
        });
      }

      console.log(JSON.stringify({ component: 'scheduler', job: 'reminder_enqueue', reminder_id: reminder.id, result: 'queued' }));
    }
  } catch (err) {
    // Silencioso — não pode derrubar o servidor.
    console.error('[cron] Erro ao checar lembretes:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE CALENDAR — avisos proativos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cache de eventos do Google que já recebiam lembrete 15 min antes.
 * Chave: `${userId}:${googleEventId}`. Limpa automaticamente entradas velhas.
 */

/** Formata datetime ISO do Google pra "HH:mm" no fuso de São Paulo. */
function formatTimeBR(iso: string | null | undefined): string {
  if (!iso) return '?';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '?';
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: DEFAULT_ACCOUNT_TIMEZONE,
    hour12: false
  });
}

/** Formata data ISO pra "DD/MM" no fuso de São Paulo. */
function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: DEFAULT_ACCOUNT_TIMEZONE
  });
}

/** Retorna "hoje" no formato YYYY-MM-DD no fuso de São Paulo. */
function todayBR(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: DEFAULT_ACCOUNT_TIMEZONE });
}

/**
 * A cada minuto: checa eventos do Google que começam em ~15 min e dispara
 * um lembrete pontual no WPP. Cada evento é lembrado no máximo uma vez.
 */
async function checkCalendarEventReminders() {
  const now = Date.now();

  // Janela: eventos que começam entre agora+14min e agora+16min.
  const from = new Date(now + 14 * 60_000);
  const to = new Date(now + 16 * 60_000);

  const users = await prisma.users.findMany({
    where: { google_refresh_token: { not: null }, status: 'active' },
    select: { id: true, account_id: true, phone_number: true, name: true }
  });

  for (const user of users) {
    try {
      if (!(await isConnected(user.id))) continue;
      const phone = user.phone_number;
      if (!phone) continue;

      const res = await listEvents(user.id, { dataInicio: todayBR(), dataFim: todayBR() });
      const eventos = res.eventos || [];

      for (const ev of eventos) {
        const startMs = ev.inicio ? new Date(ev.inicio).getTime() : NaN;
        if (!Number.isFinite(startMs)) continue;
        if (startMs < from.getTime() || startMs > to.getTime()) continue;

        const msg = `⏰ Em 15 min: *${ev.titulo}*${ev.local ? `\n📍 ${ev.local}` : ''}`;
        await enqueueReminder({ sourceType: 'google_event', sourceId: String(ev.id), occurrenceKey: new Date(startMs).toISOString(), accountId: user.account_id, userId: user.id, destination: phone, message: msg });
      }
    } catch (err: any) {
      // GOOGLE_TOKEN_REVOKED / GOOGLE_NOT_CONNECTED → silencioso (token expirado em testing).
      if (err?.message !== 'GOOGLE_NOT_CONNECTED' && err?.message !== 'GOOGLE_TOKEN_REVOKED') {
        console.error(`[cron] Erro ao checar eventos do usuário ${user.id}:`, err?.message ?? err);
      }
    }
  }
}

/**
 * 07:00 (SP): envia a agenda completa do dia para cada usuário com Google
 * conectado, SOMENTE se ele tem pelo menos 1 evento (sem spam).
 */
async function sendDailyAgenda() {
  const users = await prisma.users.findMany({
    where: { google_refresh_token: { not: null }, status: 'active' },
    select: { id: true, account_id: true, phone_number: true, name: true }
  });

  const day = todayBR();

  for (const user of users) {
    try {
      if (!(await isConnected(user.id))) continue;
      const phone = user.phone_number;
      if (!phone) continue;

      const res = await listEvents(user.id, { dataInicio: day, dataFim: day });
      const eventos = (res.eventos || []).filter(e => e.inicio);
      if (eventos.length === 0) continue; // sem eventos → silencioso

      const linhas = eventos
        .slice()
        .sort((a, b) => ((a.inicio ?? '') < (b.inicio ?? '') ? -1 : 1))
        .map(ev => `• ${formatTimeBR(ev.inicio)} — ${ev.titulo}`)
        .join('\n');

      const primeiro = eventos[0];
      const msg = `📅 *Sua agenda de hoje (${formatDateBR(primeiro?.inicio)}):*\n${linhas}\n\nTenha um bom dia! 👋`;
      await enqueueReminder({ sourceType: 'daily_agenda', sourceId: String(user.id), occurrenceKey: day, accountId: user.account_id, userId: user.id, destination: phone, message: msg });
    } catch (err: any) {
      if (err?.message !== 'GOOGLE_NOT_CONNECTED' && err?.message !== 'GOOGLE_TOKEN_REVOKED') {
        console.error(`[cron] Erro ao enviar agenda do dia para o usuário ${user.id}:`, err?.message ?? err);
      }
    }
  }
}
