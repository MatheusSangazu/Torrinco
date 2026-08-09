import { prisma } from '../lib/prisma.js';

/**
 * Centralized multi-tenant ownership validation.
 *
 * Regra: TODO acesso a recurso por ID deve passar por estas funções.
 * Elas garantem que o recurso pertence à mesma account_id (ou user_id)
 * do usuário autenticado antes de qualquer consulta, criação, alteração
 * ou exclusão.
 *
 * Padrão de retorno:
 *  - Funções `require*`: retornam o registro válido ou lançam OwnershipError.
 *  - Funções `get*`: retornam o registro ou null (para uso condicional).
 */

/** Erro de propriedade — mapeado para HTTP 403 (ou 404 para evitar enumeração). */
export class OwnershipError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = 'OwnershipError';
    this.statusCode = statusCode;
  }
}

// ── Usuário → Conta ──────────────────────────────────────────────

/**
 * Valida que `targetUserId` pertence à `accountId`.
 * Usado quando um admin opera em nome de outro usuário (target_user_id).
 * Lança 403 se o alvo não pertence à conta.
 */
export async function requireUserInAccount(targetUserId: number, accountId: number): Promise<{ id: number; account_id: number }> {
  const user = await prisma.users.findFirst({
    where: { id: targetUserId, account_id: accountId },
    select: { id: true, account_id: true }
  });
  if (!user) {
    throw new OwnershipError('Usuário-alvo não pertence a esta conta', 403);
  }
  return user;
}

// ── Categoria → Conta ────────────────────────────────────────────

/**
 * Busca uma categoria garantindo que pertence à `accountId`.
 * Retorna a categoria (com nome) ou null.
 */
export async function getCategoryForAccount(categoryId: number, accountId: number) {
  return prisma.categories.findFirst({
    where: { id: categoryId, account_id: accountId },
    select: { id: true, name: true, type: true }
  });
}

/**
 * Resolve o nome de uma categoria a partir do ID, validando pertencimento.
 * Retorna o nome ou null se a categoria não pertence à conta.
 */
export async function resolveCategoryName(categoryId: number, accountId: number): Promise<string | null> {
  const cat = await getCategoryForAccount(categoryId, accountId);
  return cat?.name ?? null;
}

// ── Entidade Financeira → Conta ──────────────────────────────────

/**
 * Busca uma entidade financeira garantindo que pertence à `accountId`.
 * Retorna a entidade ou null.
 */
export async function getEntityForAccount(entityId: number, accountId: number) {
  return prisma.financial_entities.findFirst({
    where: { id: entityId, account_id: accountId },
    select: { id: true, name: true, type: true }
  });
}

/**
 * Valida que uma entidade existe e pertence à conta.
 * Lança 403 se não pertence.
 */
export async function requireEntityInAccount(entityId: number, accountId: number) {
  const entity = await getEntityForAccount(entityId, accountId);
  if (!entity) {
    throw new OwnershipError('Entidade não pertence a esta conta', 403);
  }
  return entity;
}

// ── Fonte de Renda → Usuário ─────────────────────────────────────

/**
 * Busca uma fonte de renda garantindo que pertence ao `userId`.
 * Retorna a fonte ou null.
 */
export async function getIncomeSourceForUser(incomeSourceId: number, userId: number) {
  return prisma.income_sources.findFirst({
    where: { id: incomeSourceId, user_id: userId },
    select: { id: true, name: true }
  });
}

// ── Cartão → Conta (alias de entidade com type credit_card) ──────

/**
 * Valida que um cartão (entidade tipo credit_card) pertence à conta.
 * Lança 403 se não pertence.
 */
export async function requireCardInAccount(cardId: number, accountId: number) {
  const card = await prisma.financial_entities.findFirst({
    where: { id: cardId, account_id: accountId, type: 'credit_card' },
    select: { id: true, name: true }
  });
  if (!card) {
    throw new OwnershipError('Cartão não pertence a esta conta', 403);
  }
  return card;
}
