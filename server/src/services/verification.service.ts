import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';

/**
 * Serviço de códigos de verificação (OTP) para primeiro acesso e
 * recuperação de senha.
 *
 * Segurança:
 *  - Código gerado com crypto.randomInt (CSPRNG).
 *  - Apenas o hash SHA-256 é persistido (texto plano nunca vai ao banco).
 *  - Códigos anteriores são invalidados ao emitir um novo.
 *  - Limite de tentativas de validação por código.
 *  - Impede reutilização (flag `consumed`).
 *  - Funciona com múltiplas réplicas (estado no banco, não em memória).
 */

const CODE_LENGTH = 6;
const CODE_TTL_MINUTES = 15;
const MAX_ATTEMPTS = 5;

export type OtpPurpose = 'first_access' | 'password_reset';

/** Gera um código OTP de 6 dígitos usando crypto.randomInt (CSPRNG). */
export function generateOtpCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(CODE_LENGTH, '0');
}

/** Hash SHA-256 de uma string. */
function hashString(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export class VerificationService {
  /**
   * Cria um novo desafio OTP para um usuário.
   *
   * - Invalida todos os desafios anteriores ativos para o mesmo user+purpose.
   * - Persiste apenas o hash do código.
   * - Retorna o código em texto plano (para envio via WhatsApp).
   */
  static async createChallenge(
    userId: number,
    phoneNumber: string,
    purpose: OtpPurpose,
  ): Promise<string> {
    // Invalida códigos anteriores ativos para o mesmo usuário + finalidade.
    await prisma.otp_challenges.updateMany({
      where: {
        user_id: userId,
        purpose,
        consumed: false,
      },
      data: { consumed: true },
    });

    const code = generateOtpCode();
    const codeHash = hashString(code);
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

    await prisma.otp_challenges.create({
      data: {
        code_hash: codeHash,
        purpose,
        user_id: userId,
        phone_number: phoneNumber,
        attempts: 0,
        max_attempts: MAX_ATTEMPTS,
        consumed: false,
        expires_at: expiresAt,
      },
    });

    return code;
  }

  /**
   * Valida um código OTP.
   *
   * - Retorna { valid: true } se correto e marca como consumido (impede reuso).
   * - Incrementa contador de tentativas a cada código errado.
   * - Bloqueia após MAX_ATTEMPTS tentativas.
   * - Código expirado é rejeitado.
   * - Código já consumido é rejeitado (impede reutilização).
   *
   * `consume: true` marca o código como usado (para createPassword / resetPassword).
   * `consume: false` apenas verifica sem consumir (para validateFirstAccessCode).
   */
  static async verifyCode(
    phoneNumber: string,
    code: string,
    purpose: OtpPurpose,
    consume = false,
  ): Promise<{ valid: boolean; error?: string }> {
    const codeHash = hashString(code);

    // Busca o desafio mais recente ativo para este telefone + finalidade.
    const challenge = await prisma.otp_challenges.findFirst({
      where: {
        phone_number: phoneNumber,
        purpose,
        consumed: false,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!challenge) {
      return { valid: false, error: 'Código não encontrado ou expirado' };
    }

    // Código já consumido (verificação redundante pois filtramos consumed: false).
    if (challenge.consumed) {
      return { valid: false, error: 'Código já utilizado' };
    }

    // Código expirado.
    if (new Date() > challenge.expires_at) {
      await prisma.otp_challenges.update({
        where: { id: challenge.id },
        data: { consumed: true },
      });
      return { valid: false, error: 'Código expirado' };
    }

    // Código incorreto: incrementa tentativas.
    if (challenge.code_hash !== codeHash) {
      const newAttempts = challenge.attempts + 1;
      const blocked = newAttempts >= challenge.max_attempts;

      await prisma.otp_challenges.update({
        where: { id: challenge.id },
        data: {
          attempts: newAttempts,
          // Bloqueia após exceder o limite de tentativas.
          consumed: blocked,
        },
      });

      if (blocked) {
        return { valid: false, error: 'Número máximo de tentativas excedido' };
      }
      return { valid: false, error: 'Código inválido' };
    }

    // Código correto: consome se solicitado.
    if (consume) {
      await prisma.otp_challenges.update({
        where: { id: challenge.id },
        data: { consumed: true },
      });
    }

    return { valid: true };
  }

  /**
   * Valida E consome o código (atalho para resetPassword / createPassword).
   */
  static async verifyAndConsume(
    phoneNumber: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<{ valid: boolean; error?: string }> {
    return this.verifyCode(phoneNumber, code, purpose, true);
  }
}
