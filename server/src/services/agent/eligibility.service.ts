import { prisma } from '../../lib/prisma.js';
import type { EligibilityResult } from './types.js';

/**
 * Checagens de elegibilidade que rodam ANTES de qualquer processamento.
 *
 * Espelha as validações que estavam no n8n:
 *  1. Mensagem recebida (não enviada pelo próprio bot).
 *  2. Não é grupo.
 *  3. Telefone cadastrado → existe usuário.
 *  4. Conta com plano ativo (accounts.status ∈ {active, trial}).
 */
export async function checkEligibility(
  phone: string,
  isFromMe: boolean,
  isGroup: boolean
): Promise<EligibilityResult> {
  // 1) Ignora mensagens enviadas pelo próprio bot.
  if (isFromMe) {
    return { ok: false, reason: 'self_message' };
  }

  // 2) Ignora grupos.
  if (isGroup) {
    return { ok: false, reason: 'group_message' };
  }

  // 3) Resolve o usuário pelo telefone.
  const cleanPhone = phone.replace(/\D/g, '');
  const user = await prisma.users.findUnique({
    where: { phone_number: cleanPhone },
    include: { accounts: true }
  });
  if (!user) {
    return { ok: false, reason: 'user_not_found' };
  }

  // 4) Plano ativo.
  const status = user.accounts?.status;
  if (status !== 'active' && status !== 'trial') {
    return { ok: false, userId: user.id, reason: `plan_${status ?? 'unknown'}` };
  }

  return { ok: true, userId: user.id };
}
