import { google, type calendar_v3 } from 'googleapis';
import { prisma } from '../../lib/prisma.js';
import { getOAuth2Client, getCalendarId } from './auth.service.js';

/**
 * Integração com Google Calendar.
 *
 * Os eventos criados são espelhados na tabela local `events` (com
 * google_event_id) para que o agente consiga resolver "qual evento excluir"
 * por título/período sem precisar do ID do Google. A listagem, porém, consulta
 * diretamente o Google (fonte autoritativa — inclui eventos criados fora do app).
 *
 * Timezone padrão: America/Sao_Paulo.
 */

const TZ = 'America/Sao_Paulo';

export interface CreateEventInput {
  titulo: string;
  inicio: string;     // ISO datetime (ex: 2026-06-29T14:00:00)
  fim?: string;       // ISO datetime; default = inicio + 1h
  descricao?: string;
  local?: string;
  convidados?: string[]; // emails — o Google envia convite automaticamente
}

export interface ListEventsInput {
  dataInicio?: string; // YYYY-MM-DD (default: hoje)
  dataFim?: string;    // YYYY-MM-DD (default: dataInicio)
}

async function calendarClient(userId: number) {
  const auth = await getOAuth2Client(userId);
  return { calendar: google.calendar({ version: 'v3', auth }), calendarId: await getCalendarId(userId) };
}

/** Constrói datetime ISO a partir de data + hora (HH:mm). Default agora. */
function toDateTime(date?: string, time?: string): string {
  if (!date && !time) return new Date().toISOString();
  if (!date) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  }
  const hh = time?.split(':')[0] ?? '00';
  const mm = time?.split(':')[1] ?? '00';
  // Interpreta como horário de São Paulo e converte para ISO.
  const local = new Date(`${date}T${hh}:${mm}:00-03:00`);
  return local.toISOString();
}

/**
 * Cria um evento no Google Calendar e espelha na tabela `events`.
 */
export async function createEvent(userId: number, input: CreateEventInput) {
  const { calendar, calendarId } = await calendarClient(userId);

  const startIso = input.inicio;
  const endIso = input.fim ?? defaultEnd(input.inicio);

  const event: calendar_v3.Schema$Event = {
    summary: input.titulo,
    description: input.descricao,
    location: input.local,
    start: { dateTime: startIso, timeZone: TZ },
    end: { dateTime: endIso, timeZone: TZ },
    attendees: input.convidados?.map(email => ({ email }))
  };

  const created = await calendar.events.insert({ calendarId, requestBody: event });

  // Espelha localmente (para resolver exclusão por título depois).
  const local = await prisma.events.create({
    data: {
      user_id: userId,
      google_event_id: created.data.id ?? null,
      title: input.titulo,
      event_date: new Date(startIso),
      description: input.descricao ?? null
    }
  });

  return {
    id: created.data.id,
    local_id: local.id,
    titulo: input.titulo,
    inicio: startIso,
    fim: endIso
  };
}

/** Duração padrão de 1h a partir de um datetime ISO. */
function defaultEnd(startIso: string): string {
  return new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();
}

/**
 * Lista eventos do Google num período (início 00:00 → fim 23:59).
 */
export async function listEvents(userId: number, input: ListEventsInput = {}) {
  const { calendar, calendarId } = await calendarClient(userId);

  const dayStart = (input.dataInicio ? new Date(`${input.dataInicio}T00:00:00-03:00`) : new Date());
  const lastDay = input.dataFim ?? input.dataInicio ?? todayISO();
  const dayEnd = new Date(`${lastDay}T23:59:59-03:00`);

  const res = await calendar.events.list({
    calendarId,
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });

  const items = (res.data.items ?? []).map(e => ({
    id: e.id,
    titulo: e.summary ?? '(sem título)',
    inicio: e.start?.dateTime ?? e.start?.date,
    fim: e.end?.dateTime ?? e.end?.date,
    local: e.location,
    descricao: e.description
  }));

  return { eventos: items };
}

function todayISO(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Remove um evento do Google e da tabela local.
 * Aceita `id` (Google) ou `titulo` (resolve via tabela local).
 */
export async function deleteEvent(userId: number, opts: { id?: string; titulo?: string }) {
  const { calendar, calendarId } = await calendarClient(userId);

  let googleEventId = opts.id;

  if (!googleEventId && opts.titulo) {
    const local = await prisma.events.findFirst({
      where: { user_id: userId, title: { contains: opts.titulo } },
      orderBy: { event_date: 'desc' }
    });
    if (!local?.google_event_id) {
      return { ok: false, motivo: 'nenhum evento encontrado com esse título' };
    }
    googleEventId = local.google_event_id;
    // Limpa o registro local antecipadamente.
    await prisma.events.deleteMany({ where: { user_id: userId, google_event_id: googleEventId } });
  }

  if (!googleEventId) {
    throw new Error('Especifique o id do evento ou o título para excluir.');
  }

  await calendar.events.delete({ calendarId, eventId: googleEventId });

  // Garante limpeza do espelho local (caso não tenha vindo pela branch do título).
  await prisma.events.deleteMany({ where: { user_id: userId, google_event_id: googleEventId } });

  return { ok: true, excluido: { id: googleEventId } };
}

export interface UpdateEventInput {
  titulo?: string;        // novo título
  data?: string;          // nova data YYYY-MM-DD
  horario?: string;       // novo horário HH:mm
  duracao_minutos?: number;
  descricao?: string;
  local?: string;
}

/**
 * Atualiza um evento do Google. Resolve por `id` (Google) ou `titulo`.
 * Campos não informados são preservados (o Google aceita PATCH parcial).
 */
export async function updateEvent(
  userId: number,
  opts: { id?: string; titulo?: string; novos_dados: UpdateEventInput }
) {
  const { calendar, calendarId } = await calendarClient(userId);

  let googleEventId = opts.id;
  let originalTitle: string | undefined;

  if (!googleEventId && opts.titulo) {
    const local = await prisma.events.findFirst({
      where: { user_id: userId, title: { contains: opts.titulo } },
      orderBy: { event_date: 'desc' }
    });
    if (!local?.google_event_id) {
      return { ok: false, motivo: 'nenhum evento encontrado com esse título' };
    }
    googleEventId = local.google_event_id;
    originalTitle = local.title;
  }

  if (!googleEventId) {
    throw new Error('Especifique o id do evento ou o título para editar.');
  }

  // Monta o patch — só campos informados.
  const patch: calendar_v3.Schema$Event = {};
  if (opts.novos_dados.titulo) patch.summary = opts.novos_dados.titulo;
  if (opts.novos_dados.descricao !== undefined) patch.description = opts.novos_dados.descricao;
  if (opts.novos_dados.local !== undefined) patch.location = opts.novos_dados.local;

  if (opts.novos_dados.data || opts.novos_dados.horario || opts.novos_dados.duracao_minutos) {
    // Precisa do evento atual pra calcular novo início/fim quando só um deles muda.
    const current = await calendar.events.get({ calendarId, eventId: googleEventId });
    const currentStart = current.data.start?.dateTime
      ? new Date(current.data.start.dateTime)
      : new Date();

    const newData = opts.novos_dados.data ?? currentStart.toISOString().slice(0, 10);
    const newTime = opts.novos_dados.horario ?? `${pad(currentStart.getHours())}:${pad(currentStart.getMinutes())}`;
    const newStartIso = new Date(`${newData}T${newTime}:00-03:00`).toISOString();

    const duracao = opts.novos_dados.duracao_minutos ?? 60;
    const newEndIso = new Date(new Date(newStartIso).getTime() + duracao * 60 * 1000).toISOString();

    patch.start = { dateTime: newStartIso, timeZone: TZ };
    patch.end = { dateTime: newEndIso, timeZone: TZ };
  }

  await calendar.events.patch({ calendarId, eventId: googleEventId, requestBody: patch });

  // Atualiza espelho local se o título mudou.
  if (opts.novos_dados.titulo || originalTitle) {
    await prisma.events.updateMany({
      where: { user_id: userId, google_event_id: googleEventId },
      data: {
        title: opts.novos_dados.titulo ?? originalTitle,
        description: opts.novos_dados.descricao
      }
    });
  }

  return {
    ok: true,
    alterado: {
      id: googleEventId,
      titulo: opts.novos_dados.titulo ?? originalTitle ?? '(evento)'
    }
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
