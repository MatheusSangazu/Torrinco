import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260810000000_transaction_civil_dates/migration.sql', 'utf8');

describe('migração paralela de datas financeiras civis', () => {
  it('mantém colunas legadas e adiciona colunas DATE canônicas', () => {
    expect(schema).toContain('transaction_date         DateTime');
    expect(schema).toContain('transaction_date_civil   DateTime?');
    expect(schema).toContain('recurring_occurrence_at  DateTime?');
    expect(schema).toContain('recurring_occurrence_date DateTime?');
  });

  it('faz backfill sem remover ou alterar as colunas legadas', () => {
    expect(migration).toContain('DATE(`transaction_date`)');
    expect(migration).toContain('DATE(NEW.`transaction_date`)');
    expect(migration).not.toMatch(/DROP COLUMN `transaction_date`/);
    expect(migration).not.toMatch(/MODIFY COLUMN `transaction_date`/);
  });

  it('protege escritas legadas e unicidade da ocorrência civil', () => {
    expect(migration).toContain('transactions_civil_date_bi');
    expect(migration).toContain('transactions_civil_date_bu');
    expect(migration).toContain('transactions_recurring_civil_uq');
  });
});
