import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const c = await prisma.transactions.deleteMany({});
  const r = await prisma.recurring_transactions.deleteMany({});
  const p = await prisma.purchase_installments.deleteMany({});
  const b = await prisma.card_bills.deleteMany({});
  console.log('Limpado:', { transacoes: c.count, recorrencias: r.count, parcelas: p.count, faturas: b.count });
}
main().finally(() => prisma.$disconnect());
