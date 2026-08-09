import { z } from 'zod';

/**
 * Schemas Zod centralizados por domínio.
 *
 * Regras:
 *  - IDs: inteiros positivos (via coerce para aceitar "123" de query/params).
 *  - Valores monetários: finite, não-negativos quando apropriado.
 *  - Datas: strings não-vazias (não ISO-strict para preservar contratos do frontend).
 *  - Enums: uniões literais — sem strings arbitrárias.
 *  - Strings: limites de tamanho.
 *  - Campos extras (`.strict()`): rejeitados onde aumenta a segurança.
 *  - account_id, user_id, role: NUNCA aceitos do cliente (omitidos dos schemas).
 */

// ── Primitivos reutilizáveis ─────────────────────────────────────

/** Inteiro positivo (aceita string numérica vinda de query/params). */
const positiveInt = z.coerce.number().int().positive();

/** ID opcional anulável (para updates onde null = limpar). */
const optionalNullableId = z.union([z.coerce.number().int().positive(), z.null()]).optional();

/** Valor monetário: finite, >= 0 (aceita string numérica). */
const monetary = z.coerce.number().finite().min(0);

/** Valor monetário que pode ser negativo (para balances/saldos). */
const signedMonetary = z.coerce.number().finite();

/** String com limite razoável. */
const boundedString = (max = 500) => z.string().trim().min(1).max(max);
const optionalString = (max = 500) => z.string().trim().min(1).max(max).optional();

/** Data: string não-vazia (frontend envia formatos variados). */
const dateString = z.string().trim().min(1).max(50);

/** Frequência de recorrência. */
const frequencyEnum = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

/** Tipo de transação. */
const transactionTypeEnum = z.enum(['income', 'expense']);

/** Tipo de categoria. */
const categoryTypeEnum = z.enum(['income', 'expense']);

/** Tipo de entidade financeira. */
const entityTypeEnum = z.enum(['credit_card', 'bank', 'cash', 'investment']);

/** Dia do mês 1-31. */
const dayOfMonth = z.coerce.number().int().min(1).max(31);

/** Status de transação. */
const transactionStatusEnum = z.enum(['paid', 'pending']);

/** Método de pagamento. */
const paymentMethodEnum = z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'bank_slip', 'transfer']);

// ── Common: params / query ───────────────────────────────────────

export const commonSchemas = {
  /** Params: { id: positiveInt } */
  idParams: z.object({ id: positiveInt }),

  /** Params com dois IDs (ex: /cards/:id/bills/:billId) */
  dualIdParams: z.object({ id: positiveInt, billId: positiveInt }),

  /** Card params: { cardId: positiveInt } */
  cardIdParams: z.object({ cardId: positiveInt }),

  /** Query genérica de período. */
  periodQuery: z.object({
    period: z.string().max(20).optional(),
    target_user_id: positiveInt.optional(),
  }).strict(),

  /** Query de listagem de transações. */
  transactionListQuery: z.object({
    start_date: dateString,
    end_date: dateString,
    type: transactionTypeEnum.optional(),
    category: z.string().max(100).optional(),
    status: z.string().max(20).optional(),
  }),

  /** Query de paginação simples. */
  paginationQuery: z.object({
    limit: positiveInt.max(1000).optional(),
    offset: positiveInt.optional(),
  }),
};

// ── Auth ─────────────────────────────────────────────────────────

// Código OTP: exatamente 6 dígitos numéricos.
const otpCode = z.string().regex(/^\d{6}$/, 'Código deve ter 6 dígitos numéricos');

// Senha: mínimo 8 caracteres, pelo menos 1 letra e 1 número.
const password = z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').max(100);

export const authSchemas = {
  requestPasswordReset: z.object({
    phone_number: boundedString(30),
  }).strict(),

  resetPassword: z.object({
    phone_number: boundedString(30),
    code: otpCode,
    new_password: password,
  }).strict(),

  requestFirstAccessCode: z.object({
    phone_number: boundedString(30),
  }).strict(),

  validateFirstAccessCode: z.object({
    phone_number: boundedString(30),
    code: otpCode,
  }).strict(),

  createPassword: z.object({
    phone_number: boundedString(30),
    code: otpCode,
    password,
    accept_terms: z.literal(true),
    accept_privacy: z.literal(true),
  }).strict(),

  login: z.object({
    phone_number: boundedString(30),
    password: z.string().min(1).max(100),
  }).strict(),

  changePassword: z.object({
    old_password: z.string().min(1).max(100),
    new_password: password,
  }).strict(),

  refreshToken: z.object({
    refreshToken: z.string().min(1),
  }).strict(),

  logout: z.object({
    refreshToken: z.string().min(1),
  }).strict(),

  createUser: z.object({
    name: boundedString(200),
    phone_number: boundedString(30),
    email: z.string().email().max(200).optional(),
  }).strict(),

  updateUser: z.object({
    name: boundedString(200).optional(),
    email: z.string().email().max(200).optional(),
    role: z.enum(['admin', 'member']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }).strict(),
};

// ── Finance / Transactions ───────────────────────────────────────

export const financeSchemas = {
  create: z.object({
    amount: monetary,
    type: transactionTypeEnum,
    transaction_date: dateString,
    category: optionalString(100),
    category_id: positiveInt.optional(),
    income_source_id: positiveInt.optional(),
    description: optionalString(1000),
    status: transactionStatusEnum.optional(),
    entity_id: positiveInt.optional(),
    is_recurring: z.boolean().optional(),
    payment_method: paymentMethodEnum.optional(),
    target_user_id: positiveInt.optional(),
  }),

  update: z.object({
    amount: monetary.optional(),
    type: transactionTypeEnum.optional(),
    category: optionalString(100),
    category_id: optionalNullableId,
    income_source_id: optionalNullableId,
    description: optionalString(1000),
    transaction_date: dateString.optional(),
    status: transactionStatusEnum.optional(),
    entity_id: optionalNullableId,
    payment_method: paymentMethodEnum.optional(),
    is_recurring: z.boolean().optional(),
  }),

  deleteQuery: z.object({
    delete_type: z.string().max(20).optional(),
    is_projected: z.string().max(10).optional(),
    date: z.string().max(50).optional(),
  }),

  summaryQuery: z.object({
    period: z.string().max(20).optional(),
    target_user_id: positiveInt.optional(),
  }),

  forecastQuery: z.object({
    period: z.string().max(20).optional(),
    target_user_id: positiveInt.optional(),
  }),
};

// ── Recurring ────────────────────────────────────────────────────

export const recurringSchemas = {
  create: z.object({
    description: boundedString(500),
    amount: monetary,
    type: transactionTypeEnum,
    frequency: frequencyEnum,
    start_date: dateString,
    category: optionalString(100),
    category_id: positiveInt.optional(),
    entity_id: positiveInt.optional(),
    payment_method: paymentMethodEnum.optional(),
  }),

  update: z.object({
    description: optionalString(500),
    amount: monetary.optional(),
    category: optionalString(100),
    category_id: optionalNullableId,
    frequency: frequencyEnum.optional(),
    status: z.enum(['active', 'inactive', 'cancelled', 'pending', 'paid']).optional(),
    entity_id: optionalNullableId,
    payment_method: paymentMethodEnum.optional(),
  }),

  generate: z.object({
    transaction_date: dateString.optional(),
  }),

  listQuery: z.object({
    status: z.string().max(20).optional(),
    type: transactionTypeEnum.optional(),
  }),

  dueQuery: z.object({
    days: positiveInt.max(365).optional(),
  }),
};

// ── Cards ────────────────────────────────────────────────────────

export const cardSchemas = {
  create: z.object({
    name: boundedString(100),
    limit: signedMonetary.optional(),
    closing_day: dayOfMonth,
    due_day: dayOfMonth,
    color: optionalString(100),
  }),

  update: z.object({
    name: optionalString(100),
    limit: signedMonetary.optional(),
    closing_day: dayOfMonth.optional(),
    due_day: dayOfMonth.optional(),
    color: optionalString(100),
  }),

  billHistoryQuery: z.object({
    months: positiveInt.max(120).optional(),
  }),

  payBill: z.object({
    payment_method: z.string().max(50).optional(),
    payment_date: dateString.optional(),
  }),
};

// ── Categories ───────────────────────────────────────────────────

export const categorySchemas = {
  create: z.object({
    name: boundedString(100),
    type: categoryTypeEnum,
    color: optionalString(50),
  }),

  update: z.object({
    name: optionalString(100),
    color: optionalString(50),
  }),

  listQuery: z.object({
    type: categoryTypeEnum.optional(),
  }),
};

// ── Entities ─────────────────────────────────────────────────────

export const entitySchemas = {
  create: z.object({
    name: boundedString(100),
    type: entityTypeEnum,
    balance: signedMonetary.optional(),
    credit_limit: signedMonetary.optional(),
    closing_day: dayOfMonth.optional(),
    due_day: dayOfMonth.optional(),
  }),

  update: z.object({
    name: optionalString(100),
    type: entityTypeEnum.optional(),
    balance: signedMonetary.optional(),
    credit_limit: signedMonetary.optional(),
    closing_day: z.union([dayOfMonth, z.null()]).optional(),
    due_day: z.union([dayOfMonth, z.null()]).optional(),
  }),

  listQuery: z.object({
    type: z.string().max(50).optional(),
  }),
};

// ── Income Sources ───────────────────────────────────────────────

export const incomeSourceSchemas = {
  create: z.object({
    name: boundedString(100),
    color: optionalString(50),
  }),

  update: z.object({
    name: optionalString(100),
    color: optionalString(50),
  }),
};

// ── Budgets ──────────────────────────────────────────────────────

export const budgetSchemas = {
  upsert: z.object({
    category: boundedString(100),
    amount_limit: monetary,
    month_ref: optionalString(10),
  }),

  listQuery: z.object({
    month_ref: z.string().max(10).optional(),
  }),
};

// ── Installments ─────────────────────────────────────────────────

export const installmentSchemas = {
  create: z.object({
    entity_id: positiveInt,
    description: boundedString(500),
    amount: monetary,
    installment_count: positiveInt.max(120),
    start_date: dateString,
    category: optionalString(100),
    category_id: positiveInt.optional(),
    first_installment: positiveInt.optional(),
  }),

  updateStatus: z.object({
    status: z.enum(['active', 'completed', 'cancelled']),
  }),

  listQuery: z.object({
    entity_id: positiveInt.optional(),
    status: z.string().max(20).optional(),
  }),
};

// ── Reminders ────────────────────────────────────────────────────

export const reminderSchemas = {
  create: z.object({
    content: boundedString(1000),
    trigger_time: dateString,
    frequency: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
    specific_date: dateString.optional(),
    weekday: optionalString(20),
  }),

  update: z.object({
    content: optionalString(1000),
    trigger_time: dateString.optional(),
    frequency: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
    specific_date: z.union([dateString, z.null()]).optional(),
    weekday: optionalString(20),
    status: z.string().max(20).optional(),
  }),

  createLog: z.object({
    event_identifier: boundedString(200),
    source_type: boundedString(100),
    reminder_type: optionalString(5),
    reminder_type_new: optionalString(5),
  }),

  listQuery: z.object({
    status: z.string().max(20).optional(),
    frequency: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
    source_type: z.string().max(100).optional(),
    limit: positiveInt.max(500).optional(),
  }),
};

// ── Calendar ─────────────────────────────────────────────────────

export const calendarSchemas = {
  create: z.object({
    title: boundedString(200),
    event_date: dateString,
    description: optionalString(2000),
    google_event_id: optionalString(200),
  }),

  update: z.object({
    title: optionalString(200),
    event_date: dateString.optional(),
    description: optionalString(2000),
    google_event_id: optionalString(200),
  }),

  listQuery: z.object({
    start_date: dateString.optional(),
    end_date: dateString.optional(),
  }),
};

// ── Export ───────────────────────────────────────────────────────

export const exportSchemas = {
  query: z.object({
    start_date: dateString.optional(),
    end_date: dateString.optional(),
    type: transactionTypeEnum.optional(),
    category: z.string().max(100).optional(),
    status: z.string().max(20).optional(),
  }),
};

// ── Agent ────────────────────────────────────────────────────────

export const agentSchemas = {
  expense: z.object({
    description: boundedString(500),
    amount: monetary,
    card_name: optionalString(100),
    category: optionalString(100),
    date: dateString.optional(),
    installments: positiveInt.max(120).optional(),
    recurring: z.object({ frequency: frequencyEnum }).optional(),
    payment_method: z.string().max(50).optional(),
  }),

  income: z.object({
    description: boundedString(500),
    amount: monetary,
    category: optionalString(100),
    date: dateString.optional(),
    source_name: optionalString(100),
    recurring: z.object({ frequency: frequencyEnum }).optional(),
    payment_method: z.string().max(50).optional(),
  }),

  cardNameQuery: z.object({
    card_name: boundedString(100),
    months: positiveInt.max(120).optional(),
  }),

  payBill: z.object({
    card_name: boundedString(100),
    payment_method: z.string().max(50).optional(),
  }),

  undoBill: z.object({
    card_name: boundedString(100),
  }),
};

// ── Google ───────────────────────────────────────────────────────

export const googleSchemas = {
  callbackQuery: z.object({
    code: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    error: z.string().max(100).optional(),
  }),
};
