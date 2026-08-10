import { prisma } from '../src/lib/prisma.js';

const databaseUrl = process.env.DATABASE_URL ?? '';
const databaseName = new URL(databaseUrl).pathname.replace(/^\//, '').toLowerCase();
if (!/(^|[_-])(test|temp|ci)([_-]|$)/.test(databaseName)) {
  throw new Error(`Schema smoke recusado fora de banco temporario/teste: ${databaseName || 'nao informado'}`);
}

const reads = [
  prisma.accounts.findFirst(),
  prisma.users.findFirst(),
  prisma.transactions.findFirst(),
  prisma.financial_entities.findFirst(),
  prisma.categories.findFirst(),
  prisma.financial_imports.findFirst({ include: { items: true } }),
  prisma.financial_import_items.findFirst(),
  prisma.income_sources.findFirst(),
];

try {
  await Promise.all(reads);
  console.log('Schema smoke concluido sem P2022.');
} finally {
  await prisma.$disconnect();
}

