import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const migrationPath=fileURLToPath(new URL('../prisma/migrations/20260810002000_account_access_separation/migration.sql',import.meta.url));
const sql=readFileSync(migrationPath,'utf8');

describe('migração de acesso administrativo',()=>{
  it('cria estado de acesso independente',()=>{
    expect(sql).toContain("`access_status` ENUM('enabled', 'suspended')");
    expect(sql).toContain('`access_suspension_reason` VARCHAR(500)');
  });
  it('preserva o último estado comercial conhecido e usa expired como fallback seguro',()=>{
    expect(sql).toContain("`sh`.`previous_status` <> 'suspended'");
    expect(sql).toContain("'expired'");
    expect(sql).not.toMatch(/SET[\s\S]{0,100}`a`\.`status`\s*=\s*'active'/);
  });
});
