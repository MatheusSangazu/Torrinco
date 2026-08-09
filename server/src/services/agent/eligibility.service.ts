import { prisma } from '../../lib/prisma.js';
import { maskPhone } from '../../lib/mask.js';
import type { EligibilityResult } from './types.js';
import { assertFeature } from '../subscription.service.js';
import { recordCurrentConsents } from '../privacy.service.js';

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
  isGroup: boolean,
  consentAccepted: boolean = false
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

  // Normalização de nono dígito brasileiro: o WhatsApp pode enviar o número
  // com ou sem o "9" do celular. Tentamos as variações.
  //   55XXXXXXXXXXX (com 9, 13 dígitos)
  //   55XXXXXXXXXX  (sem 9, 12 dígitos)
  const variants = new Set<string>([cleanPhone]);
  if (cleanPhone.length === 12 && cleanPhone.startsWith('55')) {
    // Sem o 9 → adiciona (após DDI+DDD = 4 dígitos).
    variants.add(cleanPhone.slice(0, 4) + '9' + cleanPhone.slice(4));
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    // Com o 9 → remove.
    variants.add(cleanPhone.slice(0, 4) + cleanPhone.slice(5));
  }

  const user = await prisma.users.findFirst({
    where: { phone_number: { in: [...variants] } },
    include: { accounts: true }
  });

  if (!user) {
    // Auto-onboarding: se habilitado, cria account (trial) + user automaticamente.
    // Permite que novos clientes comecem a usar só mandando mensagem no WhatsApp.
    // Gate por env: o dono liga quando quer abrir pra público.
    if (process.env.ALLOW_AUTO_ONBOARDING === 'true') {
      if (!consentAccepted) return { ok: false, reason: 'consent_required' };
      try {
        const created = await autoOnboard(cleanPhone);
        await recordCurrentConsents({ userId:created.userId, accountId:created.accountId, origin:'whatsapp_onboarding', evidence:{phrase:'ACEITO TERMOS E PRIVACIDADE'} });
        console.log(`[onboarding] Nova conta trial criada: phone=${maskPhone(cleanPhone)} user=${created.userId}`);
        return { ok: true, userId: created.userId };
      } catch (err) {
        // Concorrência: outra request criou o usuário entre o find e o create.
        // Re-busca (pelos variantes) e segue com o usuário já existente.
        const concurrent = await prisma.users.findFirst({
          where: { phone_number: { in: [...variants] } },
          include: { accounts: true }
        });
        if (concurrent) {
          return { ok: true, userId: concurrent.id };
        }
        console.error('[onboarding] Falha ao criar conta e usuário:', err);
        return { ok: false, reason: 'onboarding_failed' };
      }
    }
    return { ok: false, reason: 'user_not_found' };
  }

  // 4) Acesso e feature avaliados pela mesma politica usada pela API/PWA.
  try { await assertFeature(user.account_id, 'ai'); }
  catch (error: any) { return { ok: false, userId: user.id, reason: `plan_${error.code ?? error.message}` }; }

  return { ok: true, userId: user.id };
}

/**
 * Cria uma nova conta (trial) + usuário admin a partir de um telefone.
 * Roda em transação: ou cria tudo, ou nada. Em caso de telefone duplicado
 * (race condition), rejeita e o caller trata como user_not_found.
 */
async function autoOnboard(phone: string): Promise<{ userId: number; accountId: number }> {
  return prisma.$transaction(async (tx) => {
    // Busca o plano padrão "individual" (id=1 após seed).
    const individualPlan = await tx.plans.findUnique({ where: { name: 'individual' } });
    if (!individualPlan) throw new Error('PLAN_INDIVIDUAL_NOT_FOUND');

    const account = await tx.accounts.create({
      data: {
        name: 'Minha Conta',
        plan_id: individualPlan.id,
        status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dias
      }
    });
    const newUser = await tx.users.create({
      data: {
        account_id: account.id,
        phone_number: phone,
        role: 'admin',
        status: 'active'
      }
    });
    return { userId: newUser.id, accountId: account.id };
  });
}
