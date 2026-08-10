import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('regressao do schema da Central de Importacao', () => {
  it('nao declara nem gera a coluna acidental income_sourcesId', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');
    const migration = readFileSync('prisma/migrations/20260809007000_financial_import_center/migration.sql', 'utf8');
    const generatedModel = readFileSync('src/generated/prisma-client/models/financial_import_items.ts', 'utf8');
    expect(schema).not.toContain('income_sourcesId');
    expect(migration).not.toContain('income_sourcesId');
    expect(generatedModel).not.toContain('income_sourcesId');
  });
});

