import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260810001000_technical_timestamp_precision/migration.sql', 'utf8');

describe('precisão seletiva de instantes técnicos', () => {
  it('migra os campos com requisito de ordenação e auditoria', () => {
    for (const table of ['subscription_history', 'billing_webhook_events', 'transactions', 'pending_actions', 'action_audit']) {
      expect(migration).toContain(`ALTER TABLE \`${table}\``);
    }
    expect(migration.match(/DATETIME\(3\)/g)?.length).toBe(9);
  });

  it('não altera datas civis ou instantes de autenticação', () => {
    expect(migration).not.toContain('transaction_date` DATETIME(3)');
    expect(migration).not.toContain('otp_challenges');
    expect(migration).not.toContain('refresh_tokens');
    expect(migration).not.toContain('expires_at');
  });

  it('mantém a convenção no schema Prisma', () => {
    expect(schema).toMatch(/subscription_history[\s\S]*created_at\s+DateTime\s+@default\(now\(\)\) @db\.DateTime\(3\)/);
    expect(schema).toMatch(/billing_webhook_events[\s\S]*received_at\s+DateTime\s+@default\(now\(\)\) @db\.DateTime\(3\)/);
  });
});
