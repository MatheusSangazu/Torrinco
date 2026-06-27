import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const txs = await prisma.transactions.findMany({
  select: { id: true, description: true, amount: true, type: true, category: true, payment_method: true, transaction_date: true },
  orderBy: { id: 'desc' },
  take: 10
});
console.log(`📋 Últimas ${txs.length} transações:`);
console.log(JSON.stringify(txs, null, 2));

const recurring = await prisma.recurring_transactions.findMany({ select: { description: true, amount: true, frequency: true, status: true } });
console.log(`\n🔁 Recorrências: ${recurring.length}`);
console.log(JSON.stringify(recurring, null, 2));

const purchases = await prisma.purchase_installments.findMany({ select: { description: true, amount: true, installment_count: true, status: true } });
console.log(`\n📦 Compras parceladas: ${purchases.length}`);
console.log(JSON.stringify(purchases, null, 2));

await prisma.$disconnect();
