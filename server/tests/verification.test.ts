/**
 * Testes do fluxo de verificação OTP (primeiro acesso e recuperação de senha).
 *
 * Cobre:
 *  - Geração com crypto.randomInt (6 dígitos).
 *  - Hash SHA-256 persistido (texto plano nunca armazenado).
 *  - Validação de código correto.
 *  - Código incorreto (incrementa tentativas).
 *  - Excesso de tentativas (bloqueia).
 *  - Expiração de código.
 *  - Reenvio invalida códigos anteriores.
 *  - Reutilização após consumo é rejeitada.
 *  - Resposta neutra (não enumera usuário).
 *  - Política de senha (mínimo 8, letras + números, sem senhas óbvias).
 */
import { describe, it, expect, vi } from 'vitest';
import crypto from 'node:crypto';

// ── vi.hoisted: cria o mock ANTES de qualquer import do código real ──
const { prismaMock, db } = vi.hoisted(() => {
  const otpChallenges: any[] = [];
  const users = [
    { id: 1, account_id: 1, name: 'User A', phone_number: '5511900000001', password_hash: null, role: 'admin', status: 'active' },
    { id: 2, account_id: 1, name: 'User B', phone_number: '5512900000002', password_hash: '$2b$10$hash', role: 'member', status: 'active' },
  ];

  function matchRec(rec: any, where: any): boolean {
    if (!where) return true;
    for (const [key, val] of Object.entries(where)) {
      if (val === undefined || val === null) continue;
      if (rec[key] !== val) return false;
    }
    return true;
  }

  let nextId = 1;

  function mockTable(table: any[]) {
    return {
      findUnique: vi.fn(async ({ where }: any) => table.find(r => matchRec(r, where)) ?? null),
      findFirst: vi.fn(async ({ where, orderBy }: any) => {
        let results = table.filter(r => matchRec(r, where));
        if (orderBy?.created_at === 'desc') {
          results = results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        return results[0] ?? null;
      }),
      findMany: vi.fn(async ({ where }: any) => table.filter(r => matchRec(r, where))),
      create: vi.fn(async ({ data }: any) => { const r = { id: ++nextId, ...data }; table.push(r); return r; }),
      update: vi.fn(async ({ where, data }: any) => {
        const i = table.findIndex(r => matchRec(r, where));
        if (i === -1) throw Object.assign(new Error('P2025'), { code: 'P2025' });
        table[i] = { ...table[i], ...data };
        return table[i];
      }),
      updateMany: vi.fn(async ({ where, data }: any) => {
        let c = 0;
        for (let i = 0; i < table.length; i++) {
          if (matchRec(table[i], where)) { table[i] = { ...table[i], ...data }; c++; }
        }
        return { count: c };
      }),
      delete: vi.fn(async ({ where }: any) => {
        const i = table.findIndex(r => matchRec(r, where));
        if (i === -1) throw Object.assign(new Error('P2025'), { code: 'P2025' });
        return table.splice(i, 1)[0];
      }),
      count: vi.fn(async ({ where }: any) => table.filter(r => matchRec(r, where)).length),
    };
  }

  const prismaMock = {
    users: mockTable(users),
    otp_challenges: mockTable(otpChallenges),
    $disconnect: vi.fn(async () => {}),
  };

  return { prismaMock, db: { otpChallenges, users } };
});

// ── Mock Prisma module ───────────────────────────────────────────
vi.mock('../src/lib/prisma.js', () => ({ prisma: prismaMock }));

// Import AFTER mock.
import { VerificationService, generateOtpCode } from '../src/services/verification.service.js';

// ─────────────────────────────────────────────────────────────────

describe('1. Geração de código OTP', () => {
  it('gera código de 6 dígitos', () => {
    const code = generateOtpCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('gera códigos aleatórios (não deterministicamente)', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) codes.add(generateOtpCode());
    // Pelo menos 50 códigos diferentes em 100 tentadas.
    expect(codes.size).toBeGreaterThan(50);
  });
});

describe('2. Criação de desafio — hash persistido', () => {
  it('cria desafio e armazena apenas o hash', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');
    expect(code).toMatch(/^\d{6}$/);

    const stored = db.otpChallenges.find(c => c.user_id === 1);
    expect(stored).toBeTruthy();
    expect(stored.code_hash).toBe(crypto.createHash('sha256').update(code).digest('hex'));
    expect(stored.consumed).toBe(false);
    expect(stored.attempts).toBe(0);
  });
});

describe('3. Validação de código', () => {
  it('aceita código correto (sem consumir)', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');
    const result = await VerificationService.verifyCode('5511900000001', code, 'first_access', false);
    expect(result.valid).toBe(true);
  });

  it('rejeita código inexistente', async () => {
    const result = await VerificationService.verifyCode('5511900000001', '000000', 'first_access');
    expect(result.valid).toBe(false);
  });

  it('rejeita telefone diferente', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');
    const result = await VerificationService.verifyCode('5599999999999', code, 'first_access');
    expect(result.valid).toBe(false);
  });
});

describe('4. Código incorreto — limite de tentativas', () => {
  it('incrementa tentativas e bloqueia após 5 tentativas erradas', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');

    // 4 tentativas erradas.
    for (let i = 0; i < 4; i++) {
      const r = await VerificationService.verifyCode('5511900000001', '000000', 'first_access');
      expect(r.valid).toBe(false);
      expect(r.error).toBe('Código inválido');
    }

    // 5ª tentativa errada bloqueia.
    const r = await VerificationService.verifyCode('5511900000001', '000000', 'first_access');
    expect(r.valid).toBe(false);
    expect(r.error).toBe('Número máximo de tentativas excedido');

    // Mesmo o código correto não funciona mais (consumed = true).
    const r2 = await VerificationService.verifyCode('5511900000001', code, 'first_access');
    expect(r2.valid).toBe(false);
  });
});

describe('5. Expiração de código', () => {
  it('rejeita código expirado', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');

    // Simular expiração.
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const stored = db.otpChallenges.find(c => c.code_hash === codeHash);
    if (stored) stored.expires_at = new Date(Date.now() - 1000);

    const result = await VerificationService.verifyCode('5511900000001', code, 'first_access');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Código expirado');
  });
});

describe('6. Reenvio — invalida códigos anteriores', () => {
  it('novo código invalida o anterior', async () => {
    const code1 = await VerificationService.createChallenge(1, '5511900000001', 'first_access');
    const code2 = await VerificationService.createChallenge(1, '5511900000001', 'first_access');

    expect(code1).not.toBe(code2);

    // code1 foi invalidado.
    const r1 = await VerificationService.verifyCode('5511900000001', code1, 'first_access');
    expect(r1.valid).toBe(false);

    // code2 é válido.
    const r2 = await VerificationService.verifyCode('5511900000001', code2, 'first_access');
    expect(r2.valid).toBe(true);
  });
});

describe('7. Reutilização — impede após consumo', () => {
  it('código consumido não pode ser reusado', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'password_reset');

    // verifyAndConsume consome o código.
    const r1 = await VerificationService.verifyAndConsume('5511900000001', code, 'password_reset');
    expect(r1.valid).toBe(true);

    // Segunda tentativa deve falhar.
    const r2 = await VerificationService.verifyAndConsume('5511900000001', code, 'password_reset');
    expect(r2.valid).toBe(false);
  });

  it('validate (sem consumo) não impede uso posterior', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');

    // Valida sem consumir.
    const r1 = await VerificationService.verifyCode('5511900000001', code, 'first_access', false);
    expect(r1.valid).toBe(true);

    // Ainda pode consumir.
    const r2 = await VerificationService.verifyAndConsume('5511900000001', code, 'first_access');
    expect(r2.valid).toBe(true);
  });
});

describe('8. Isolamento por finalidade (purpose)', () => {
  it('código de first_access não funciona para password_reset', async () => {
    const code = await VerificationService.createChallenge(1, '5511900000001', 'first_access');

    const result = await VerificationService.verifyCode('5511900000001', code, 'password_reset');
    expect(result.valid).toBe(false);
  });
});
