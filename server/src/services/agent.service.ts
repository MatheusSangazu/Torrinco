import { prisma } from '../lib/prisma.js';
import { parseDate, todayUTC } from '../lib/date-utils.js';
import { createInstallmentPurchase } from './installments.service.js';
import { createRecurring, materializeDue, listDueSoon } from './recurring.service.js';
import { getOrCreateCurrentBill, getBillDetails, getHistory, registerPayment, undoPayment } from './billing.service.js';
import { getSummary, getForecast } from './summary.service.js';
import { getAuthUrl, isConnected } from './google/auth.service.js';
import * as gcal from './google/calendar.service.js';
import type { Frequency } from '../lib/date-utils.js';

/**
 * Camada agent-friendly: expõe a lógica de domínio por INTENÇÃO, escondendo
 * regras internas (ciclo de fatura, category_id, parcelamento por trás de flags).
 *
 * O agente de IA (FASE 8) chama estes métodos diretamente. Endpoints REST
 * correspondentes em agent.routes expõem o mesmo contrato para integrações
 * externas e para a spec OpenAPI.
 *
 * Normalização:
 *  - `card_name` → resolve `entity_id` por nome aproximado (case-insensitive).
 *  - `category` → resolve `category_id` por nome, criando se não existir.
 *  - `installments: N` → delega ao installments.service (respeita closing_day).
 *  - `recurring: {frequency}` → delega ao recurring.service (template).
 */

export interface RegisterExpenseInput {
  description: string;
  amount: number;
  card_name?: string;        // resolve entity_id; se ausente → débito/dinheiro
  category?: string;         // resolve/cria categoria
  date?: string;             // default hoje
  installments?: number;     // > 1 → compra parcelada no cartão
  recurring?: { frequency: Frequency }; // presente → cria recorrência
  payment_method?: string;
}

export interface RegisterIncomeInput {
  description: string;
  amount: number;
  category?: string;
  date?: string;
  source_name?: string;      // nome da fonte de renda (income_sources)
  recurring?: { frequency: Frequency };
  payment_method?: string;
}

/** Resolve o entity_id (cartão) por nome aproximado. Retorna null se não achar. */
async function resolveCardByName(userId: number, name: string): Promise<number | null> {
  const lower = name.trim().toLowerCase();
  const cards = await prisma.financial_entities.findMany({
    where: { user_id: userId, type: 'credit_card' },
    select: { id: true, name: true }
  });
  // Match exato case-insensitive primeiro, depois "contains".
  const exact = cards.find(c => c.name.trim().toLowerCase() === lower);
  if (exact) return exact.id;
  const partial = cards.find(c => c.name.trim().toLowerCase().includes(lower) || lower.includes(c.name.trim().toLowerCase()));
  return partial ? partial.id : null;
}

/** Resolve ou cria categoria por nome. Retorna {id, name}. */
async function resolveCategory(userId: number, name: string, type: 'income' | 'expense') {
  const lower = name.trim().toLowerCase();
  const existing = await prisma.categories.findFirst({
    where: { user_id: userId, type }
  });
  // Busca por nome (case-insensitive) dentro do tipo.
  const match = await prisma.categories.findFirst({
    where: {
      user_id: userId,
      type,
      name: { equals: name.trim() }
    }
  });
  if (match) return { id: match.id, name: match.name };
  void existing; void lower;
  // Cria se não existir.
  const created = await prisma.categories.create({
    data: { user_id: userId, name: name.trim(), type }
  });
  return { id: created.id, name: created.name };
}

/** Resolve a account_id do usuário (primeira conta). */
async function getAccountId(userId: number): Promise<number> {
  const account = await prisma.accounts.findFirst({
    where: { users: { some: { id: userId } } }
  });
  if (!account) throw new Error('ACCOUNT_NOT_FOUND');
  return account.id;
}

/**
 * Registra uma despesa. Decide o caminho conforme as flags:
 *  - recurring → cria recorrência (template).
 *  - installments > 1 (exige cartão) → compra parcelada.
 *  - caso contrário → transação simples.
 */
export async function registerExpense(userId: number, input: RegisterExpenseInput) {
  const date = input.date ? parseDate(input.date) : todayUTC();

  // 1) Recorrência — cria template (não parcela).
  if (input.recurring) {
    const cardId = input.card_name ? await resolveCardByName(userId, input.card_name) : null;
    if (input.card_name && !cardId) throw new Error(`Cartão não encontrado: ${input.card_name}`);

    const recurring = await createRecurring(userId, {
      description: input.description,
      amount: input.amount,
      type: 'expense',
      frequency: input.recurring.frequency,
      start_date: date,
      category: input.category,
      entity_id: cardId ?? undefined,
      payment_method: cardId ? 'credit' : (input.payment_method ?? 'pix')
    });
    return { kind: 'recurring', recurring };
  }

  // 2) Parcelamento — exige cartão.
  if (input.installments && input.installments > 1) {
    if (!input.card_name) throw new Error('Parcelamento exige cartão (card_name)');
    const cardId = await resolveCardByName(userId, input.card_name);
    if (!cardId) throw new Error(`Cartão não encontrado: ${input.card_name}`);

    const cat = input.category ? await resolveCategory(userId, input.category, 'expense') : null;
    const purchase = await createInstallmentPurchase(userId, {
      entity_id: cardId,
      description: input.description,
      amount: input.amount,
      installment_count: input.installments,
      start_date: date,
      category: cat?.name,
      category_id: cat?.id
    });
    return { kind: 'installments', purchase };
  }

  // 3) Despesa simples.
  const accountId = await getAccountId(userId);
  const cardId = input.card_name ? await resolveCardByName(userId, input.card_name) : null;
  if (input.card_name && !cardId) throw new Error(`Cartão não encontrado: ${input.card_name}`);
  const cat = input.category ? await resolveCategory(userId, input.category, 'expense') : null;

  const transaction = await prisma.transactions.create({
    data: {
      account_id: accountId,
      user_id: userId,
      entity_id: cardId,
      amount: input.amount,
      type: 'expense',
      status: 'paid',
      category: cat?.name ?? null,
      category_id: cat?.id ?? null,
      description: input.description,
      transaction_date: date,
      payment_method: cardId ? 'credit' : (input.payment_method ?? 'pix')
    }
  });
  return { kind: 'expense', transaction };
}

/**
 * Registra uma receita. Se `recurring` presente, cria recorrência.
 */
export async function registerIncome(userId: number, input: RegisterIncomeInput) {
  const date = input.date ? parseDate(input.date) : todayUTC();

  if (input.recurring) {
    const recurring = await createRecurring(userId, {
      description: input.description,
      amount: input.amount,
      type: 'income',
      frequency: input.recurring.frequency,
      start_date: date,
      category: input.category,
      payment_method: input.payment_method ?? 'pix'
    });
    return { kind: 'recurring', recurring };
  }

  const accountId = await getAccountId(userId);
  const cat = input.category ? await resolveCategory(userId, input.category, 'income') : null;

  const transaction = await prisma.transactions.create({
    data: {
      account_id: accountId,
      user_id: userId,
      amount: input.amount,
      type: 'income',
      status: 'paid',
      category: cat?.name ?? null,
      category_id: cat?.id ?? null,
      description: input.description,
      transaction_date: date,
      payment_method: input.payment_method ?? 'pix'
    }
  });
  return { kind: 'income', transaction };
}

/** Resumo financeiro (saldo + resumo do mês) — texto estruturado para o agente. */
export async function getBalance(userId: number) {
  const { month_summary } = await getSummary(userId, 'month');
  return {
    mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    receitas: month_summary.income,
    despesas: month_summary.expense,
    saldo_mes: month_summary.balance,
    saldo_caixa: month_summary.cash_balance
  };
}

/** Previsão do próximo mês. */
export async function getForecastForAgent(userId: number) {
  return getForecast(userId, 'next_month');
}

/** Próximos vencimentos: recorrências + faturas a vencer. */
export async function getUpcoming(userId: number) {
  const [recurring, cards] = await Promise.all([
    listDueSoon(userId, 10),
    prisma.financial_entities.findMany({
      where: { user_id: userId, type: 'credit_card' },
      select: { id: true, name: true }
    })
  ]);

  const bills: any[] = [];
  for (const card of cards) {
    const { bill } = await getOrCreateCurrentBill(card.id, userId);
    if (bill.status !== 'paid') {
      const details = await getBillDetails(bill.id, userId);
      bills.push({
        cartao: card.name,
        vencimento: bill.due_date,
        total: details.bill.total_amount,
        status: bill.status
      });
    }
  }

  return {
    recorrencias: recurring.map(r => ({
      descricao: r.description,
      valor: Number(r.amount),
      tipo: r.type,
      proximo_vencimento: r.next_due_date,
      frequencia: r.frequency
    })),
    faturas: bills
  };
}

/** Lista as faturas de um cartão por nome. */
export async function getCardBill(userId: number, cardName: string) {
  const cardId = await resolveCardByName(userId, cardName);
  if (!cardId) throw new Error(`Cartão não encontrado: ${cardName}`);
  const { bill } = await getOrCreateCurrentBill(cardId, userId);
  return getBillDetails(bill.id, userId);
}

/** Paga a fatura atual de um cartão (por nome). */
export async function payCardBill(userId: number, cardName: string, paymentMethod: string = 'pix') {
  const cardId = await resolveCardByName(userId, cardName);
  if (!cardId) throw new Error(`Cartão não encontrado: ${cardName}`);
  const { bill } = await getOrCreateCurrentBill(cardId, userId);
  return registerPayment(bill.id, userId, paymentMethod);
}

/** Desfaz o pagamento da fatura atual de um cartão (por nome). */
export async function undoCardBill(userId: number, cardName: string) {
  const cardId = await resolveCardByName(userId, cardName);
  if (!cardId) throw new Error(`Cartão não encontrado: ${cardName}`);
  const { bill } = await getOrCreateCurrentBill(cardId, userId);
  return undoPayment(bill.id, userId);
}

/** Força a materialização de recorrências vencidas (dados frescos para o agente). */
export async function refreshDue(userId: number) {
  const created = await materializeDue(userId);
  return { materializadas: created.length };
}

/** Histórico de faturas de um cartão (por nome). */
export async function getCardHistory(userId: number, cardName: string, months: number = 6) {
  const cardId = await resolveCardByName(userId, cardName);
  if (!cardId) throw new Error(`Cartão não encontrado: ${cardName}`);
  return getHistory(cardId, userId, months);
}

/**
 * Lista todos os cartões de crédito e contas do usuário.
 * Útil quando o usuário pergunta "quais são meus cartões?" ou precisa escolher.
 */
export async function listCards(userId: number) {
  const entities = await prisma.financial_entities.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      name: true,
      type: true,
      closing_day: true,
      due_day: true
    },
    orderBy: [{ type: 'asc' }, { name: 'asc' }]
  });

  const cards = entities
    .filter(e => e.type === 'credit_card')
    .map(e => ({
      id: e.id,
      nome: e.name,
      tipo: 'cartão de crédito',
      fechamento: e.closing_day,
      vencimento: e.due_day
    }));

  const banks = entities
    .filter(e => e.type === 'bank')
    .map(e => ({
      id: e.id,
      nome: e.name,
      tipo: 'conta bancária'
    }));

  return { cartoes: cards, contas: banks };
}

/**
 * Exclui (soft delete) uma transação do usuário.
 * Suporta busca por:
 *  - id direto
 *  - "última" (mais recente)
 *  - descrição aproximada (retorna a mais recente que bate)
 *
 * Retorna a transação excluída para confirmação do agente.
 */
export async function deleteTransaction(
  userId: number,
  opts: { id?: number; ultima?: boolean; descricao?: string }
) {
  let where: any = { user_id: userId, deleted_at: null };

  if (opts.id) {
    where.id = opts.id;
  } else if (opts.ultima) {
    // mais recente
  } else if (opts.descricao) {
    where.description = { contains: opts.descricao };
  } else {
    throw new Error('Especifique qual transação excluir (id, ultima=true, ou descricao).');
  }

  const tx = await prisma.transactions.findFirst({
    where,
    orderBy: opts.descricao
      ? { transaction_date: 'desc' }
      : { id: 'desc' },
    select: {
      id: true, description: true, amount: true, type: true,
      transaction_date: true, payment_method: true, entity_id: true
    }
  });

  if (!tx) {
    return { ok: false, motivo: 'nenhuma transação encontrada com esse critério' };
  }

  // Soft delete.
  await prisma.transactions.update({
    where: { id: tx.id },
    data: { deleted_at: new Date() }
  });

  return {
    ok: true,
    excluida: {
      id: tx.id,
      descricao: tx.description,
      valor: Number(tx.amount),
      tipo: tx.type,
      data: tx.transaction_date,
      pagamento: tx.payment_method
    }
  };
}

/**
 * Edita uma transação existente.
 * Permite alterar: descrição, valor, data, categoria, forma_pagamento.
 * Busca a transação por id, "última", ou descrição aproximada.
 */
export async function editTransaction(
  userId: number,
  opts: {
    id?: number;
    ultima?: boolean;
    descricao?: string;
    nova_descricao?: string;
    novo_valor?: number;
    nova_data?: string;
    nova_categoria?: string;
    nova_forma_pagamento?: string;
  }
) {
  let where: any = { user_id: userId, deleted_at: null };

  if (opts.id) {
    where.id = opts.id;
  } else if (opts.descricao) {
    where.description = { contains: opts.descricao };
  } else if (opts.ultima) {
    // mais recente
  } else {
    throw new Error('Especifique qual transação editar (id, ultima=true, ou descricao).');
  }

  const tx = await prisma.transactions.findFirst({
    where,
    orderBy: { id: 'desc' }
  });

  if (!tx) {
    return { ok: false, motivo: 'nenhuma transação encontrada com esse critério' };
  }

  const data: any = {};
  if (opts.nova_descricao) data.description = opts.nova_descricao;
  if (opts.novo_valor !== undefined) data.amount = opts.novo_valor;
  if (opts.nova_data) data.transaction_date = parseDate(opts.nova_data);
  if (opts.nova_forma_pagamento) data.payment_method = opts.nova_forma_pagamento;
  if (opts.nova_categoria) {
    const cat = await resolveCategory(userId, opts.nova_categoria, tx.type);
    data.category = cat.name;
    data.category_id = cat.id;
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, motivo: 'nenhum campo para alterar foi informado' };
  }

  await prisma.transactions.update({ where: { id: tx.id }, data });

  return {
    ok: true,
    alterada: {
      id: tx.id,
      descricao_anterior: tx.description,
      valor_anterior: Number(tx.amount)
    }
  };
}

/**
 * Relatório de gastos por categoria num período.
 * Permite: "quanto gastei com mercado este mês?" ou "meu gasto com transporte em junho".
 *
 * Se `categoria` for informado, filtra por aquela. Caso contrário, agrupa todas.
 * `periodo` aceita: "mes" (atual), "mes_passado", "ano", ou um mês/ano específico.
 */
export async function getReportByCategory(
  userId: number,
  opts: { categoria?: string; periodo?: string; mes?: number; ano?: number }
) {
  const now = new Date();
  let start: Date;
  let end: Date;

  const periodo = opts.periodo ?? 'mes';
  if (periodo === 'mes') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (periodo === 'mes_passado') {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (periodo === 'ano') {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  } else if (opts.mes && opts.ano) {
    // Mês/ano específico (1-12).
    start = new Date(opts.ano, opts.mes - 1, 1);
    end = new Date(opts.ano, opts.mes, 0, 23, 59, 59, 999);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const where: any = {
    user_id: userId,
    type: 'expense',
    deleted_at: null,
    transaction_date: { gte: start, lte: end }
  };

  if (opts.categoria) {
    // Busca aproximada (case-insensitive via contains).
    where.OR = [
      { category: { contains: opts.categoria } },
      { description: { contains: opts.categoria } }
    ];
    delete where.category;
  }

  const transactions = await prisma.transactions.findMany({
    where,
    select: { amount: true, category: true, description: true, transaction_date: true },
    orderBy: { transaction_date: 'desc' }
  });

  // Agrupa por categoria.
  const byCategory = new Map<string, { total: number; count: number }>();
  for (const tx of transactions) {
    const cat = tx.category ?? 'Sem categoria';
    const entry = byCategory.get(cat) ?? { total: 0, count: 0 };
    entry.total += Number(tx.amount);
    entry.count += 1;
    byCategory.set(cat, entry);
  }

  const categorias = [...byCategory.entries()]
    .map(([nome, dados]) => ({ categoria: nome, total: dados.total, transacoes: dados.count }))
    .sort((a, b) => b.total - a.total);

  const totalGeral = categorias.reduce((s, c) => s + c.total, 0);

  return {
    periodo: { inicio: start, fim: end },
    total_geral: totalGeral,
    total_transacoes: transactions.length,
    categorias,
    // Se filtrou por categoria, mostra também as transações individuais.
    transacoes: opts.categoria
      ? transactions.map(t => ({
          descricao: t.description,
          valor: Number(t.amount),
          categoria: t.category ?? 'Sem categoria',
          data: t.transaction_date
        }))
      : undefined
  };
}

/**
 * Cria um lembrete para o usuário.
 * O lembrete será disparado no WhatsApp no horário especificado.
 *
 * - frequency 'once' requer specific_date (data + hora).
 * - frequency 'daily' requer trigger_time (hora).
 * - frequency 'weekly' requer trigger_time + weekday.
 * - frequency 'monthly' requer trigger_time + dia do mês (specific_date).
 */
export async function createReminder(
  userId: number,
  opts: {
    conteudo: string;
    horario: string;          // "HH:mm"
    frequencia?: 'once' | 'daily' | 'weekly' | 'monthly';
    data?: string;            // YYYY-MM-DD (para once ou dia do mês)
    dia_semana?: string;      // Monday, Tuesday...
  }
) {
  const frequency = opts.frequencia ?? 'once';

  // Combina data + horário para o trigger_time.
  const datePart = opts.data ?? new Date().toISOString().slice(0, 10);
  const triggerTime = new Date(`${datePart}T${opts.horario}:00`);

  if (isNaN(triggerTime.getTime())) {
    throw new Error(`Horário inválido: ${opts.horario}`);
  }

  const reminder = await prisma.reminders.create({
    data: {
      user_id: userId,
      content: opts.conteudo,
      trigger_time: triggerTime,
      frequency,
      specific_date: opts.data ? new Date(opts.data) : (frequency === 'once' ? triggerTime : null),
      weekday: opts.dia_semana as any,
      status: 'active'
    }
  });

  return {
    ok: true,
    id: reminder.id,
    conteudo: reminder.content,
    horario: opts.horario,
    frequencia: frequency,
    data: opts.data,
    dia_semana: opts.dia_semana
  };
}

/**
 * Lista os lembretes ativos do usuário.
 */
export async function listReminders(userId: number) {
  const reminders = await prisma.reminders.findMany({
    where: { user_id: userId, status: 'active' },
    orderBy: { trigger_time: 'asc' },
    select: {
      id: true,
      content: true,
      trigger_time: true,
      frequency: true,
      specific_date: true,
      weekday: true
    }
  });

  return {
    lembretes: reminders.map(r => ({
      id: r.id,
      conteudo: r.content,
      horario: r.trigger_time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      frequencia: r.frequency,
      data: r.specific_date,
      dia_semana: r.weekday
    }))
  };
}

/**
 * Exclui (marca como inativo) um lembrete.
 */
export async function deleteReminder(userId: number, opts: { id?: number; conteudo?: string }) {
  const where: any = { user_id: userId, status: 'active' };

  if (opts.id) {
    where.id = opts.id;
  } else if (opts.conteudo) {
    where.content = { contains: opts.conteudo };
  } else {
    throw new Error('Especifique qual lembrete excluir (id ou parte do conteúdo).');
  }

  const reminder = await prisma.reminders.findFirst({ where });
  if (!reminder) {
    return { ok: false, motivo: 'nenhum lembrete encontrado com esse critério' };
  }

  await prisma.reminders.update({
    where: { id: reminder.id },
    data: { status: 'inactive' }
  });

  return {
    ok: true,
    excluido: { id: reminder.id, conteudo: reminder.content }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE CALENDAR (FASE 9.6)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica a conexão com o Google. Se conectado, retorna o email; se não,
 * retorna a URL de autorização para o agente enviar no WhatsApp.
 */
export async function connectGoogle(userId: number) {
  if (await isConnected(userId)) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { google_email: true }
    });
    return { conectado: true, email: user?.google_email ?? null };
  }
  return { conectado: false, url_autorizacao: getAuthUrl(userId) };
}

/**
 * Cria um evento na agenda Google do usuário.
 * Se a agenda não estiver conectada, retorna a URL de autorização (o agente
 * orienta o usuário a conectar primeiro).
 *
 * Datas/horários chegam como strings ISO (geradas pelo agente a partir da
 * linguagem natural). Duração padrão de 1h quando `fim` não informado.
 */
export async function createCalendarEvent(
  userId: number,
  opts: { titulo: string; inicio: string; fim?: string; descricao?: string; local?: string; convidados?: string[] }
) {
  try {
    return await gcal.createEvent(userId, opts);
  } catch (err: any) {
    if (err?.message === 'GOOGLE_NOT_CONNECTED' || err?.message === 'GOOGLE_TOKEN_REVOKED') {
      return { nao_conectado: true, url_autorizacao: getAuthUrl(userId) };
    }
    throw err;
  }
}

/** Lista eventos da agenda Google num período (default: hoje). */
export async function listCalendarEvents(
  userId: number,
  opts: { data_inicio?: string; data_fim?: string }
) {
  try {
    return await gcal.listEvents(userId, {
      dataInicio: opts.data_inicio,
      dataFim: opts.data_fim
    });
  } catch (err: any) {
    if (err?.message === 'GOOGLE_NOT_CONNECTED' || err?.message === 'GOOGLE_TOKEN_REVOKED') {
      return { nao_conectado: true, url_autorizacao: getAuthUrl(userId) };
    }
    throw err;
  }
}

/** Exclui um evento da agenda Google por id ou título. */
export async function deleteCalendarEvent(
  userId: number,
  opts: { id?: string; titulo?: string }
) {
  try {
    return await gcal.deleteEvent(userId, opts);
  } catch (err: any) {
    if (err?.message === 'GOOGLE_NOT_CONNECTED' || err?.message === 'GOOGLE_TOKEN_REVOKED') {
      return { nao_conectado: true, url_autorizacao: getAuthUrl(userId) };
    }
    throw err;
  }
}
