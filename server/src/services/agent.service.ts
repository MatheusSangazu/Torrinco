import { prisma } from '../lib/prisma.js';
import { parseDate, todayUTC } from '../lib/date-utils.js';
import { createInstallmentPurchase } from './installments.service.js';
import { createRecurring, materializeDue, listDueSoon } from './recurring.service.js';
import { getOrCreateCurrentBill, getBillDetails, getHistory, registerPayment, undoPayment } from './billing.service.js';
import { getSummary, getForecast } from './summary.service.js';
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
