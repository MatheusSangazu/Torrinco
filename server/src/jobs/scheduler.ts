import cron from 'node-cron';
import { runDailyJobs } from '../services/scheduler.service.js';
import { EvolutionService } from '../services/evolution.service.js';
import { prisma } from '../lib/prisma.js';
import { isConnected } from '../services/google/auth.service.js';
import { listEvents } from '../services/google/calendar.service.js';

/**
 * Registro dos jobs agendados do servidor.
 *
 * - A cada minuto: dispara lembretes internos + lembretes de eventos do Google.
 * - 07:00 (SP): envia a agenda do dia para quem tem Google conectado.
 * - 03:00: materializa recorrências e sincroniza faturas.
 */
export function startScheduledJobs() {
  // A cada minuto — checa lembretes internos prontos para disparar.
  cron.schedule('* * * * *', async () => {
    await checkReminders();
    await checkCalendarEventReminders();
  });

  // 07:00 horário de SP — agenda do dia (somente se o usuário tem eventos).
  cron.schedule('0 7 * * *', async () => {
    await sendDailyAgenda();
  }, { timezone: 'America/Sao_Paulo' });

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

  console.log('✅ Jobs agendados registrados (lembretes a cada min, agenda às 07:00, recorrências às 03:00).');
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

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE CALENDAR — avisos proativos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cache de eventos do Google que já recebiam lembrete 15 min antes.
 * Chave: `${userId}:${googleEventId}`. Limpa automaticamente entradas velhas.
 */
const remindedEvents = new Map<string, number>(); // id → timestamp de quando o evento começa
const REMINDER_TTL_MS = 60 * 60 * 1000; // 1h

function cleanupRemindedCache(now: number): void {
  for (const [key, eventStart] of remindedEvents) {
    if (eventStart + REMINDER_TTL_MS < now) {
      remindedEvents.delete(key);
    }
  }
}

/** Formata datetime ISO do Google pra "HH:mm" no fuso de São Paulo. */
function formatTimeBR(iso: string | null | undefined): string {
  if (!iso) return '?';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '?';
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
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
    timeZone: 'America/Sao_Paulo'
  });
}

/** Retorna "hoje" no formato YYYY-MM-DD no fuso de São Paulo. */
function todayBR(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

/**
 * A cada minuto: checa eventos do Google que começam em ~15 min e dispara
 * um lembrete pontual no WPP. Cada evento é lembrado no máximo uma vez.
 */
async function checkCalendarEventReminders() {
  const now = Date.now();
  cleanupRemindedCache(now);

  // Janela: eventos que começam entre agora+14min e agora+16min.
  const from = new Date(now + 14 * 60_000);
  const to = new Date(now + 16 * 60_000);

  const users = await prisma.users.findMany({
    where: { google_refresh_token: { not: null } },
    select: { id: true, phone_number: true, name: true }
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

        const key = `${user.id}:${ev.id}`;
        if (remindedEvents.has(key)) continue; // já lembrado
        remindedEvents.set(key, startMs);

        const msg = `⏰ Em 15 min: *${ev.titulo}*${ev.local ? `\n📍 ${ev.local}` : ''}`;
        await EvolutionService.sendText(phone, msg);
        console.log(`[cron] Lembrete de evento enviado para ${phone}: ${ev.titulo}`);
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
    where: { google_refresh_token: { not: null } },
    select: { id: true, phone_number: true, name: true }
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
      await EvolutionService.sendText(phone, msg);
      console.log(`[cron] Agenda do dia enviada para ${phone}: ${eventos.length} evento(s).`);
    } catch (err: any) {
      if (err?.message !== 'GOOGLE_NOT_CONNECTED' && err?.message !== 'GOOGLE_TOKEN_REVOKED') {
        console.error(`[cron] Erro ao enviar agenda do dia para o usuário ${user.id}:`, err?.message ?? err);
      }
    }
  }
}
