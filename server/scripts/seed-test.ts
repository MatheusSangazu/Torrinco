/**
 * Cria dados de teste: conta ativa + usuário (com seu WhatsApp) + cartão Nubank.
 *
 * Uso:  npx tsx scripts/seed-test.ts
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const PHONE = '5579981003085';

async function main() {
  // Conta
  const account = await prisma.accounts.create({
    data: { name: 'Minha Conta', plan_type: 'individual', status: 'active' }
  });

  // Usuário (sem senha — autenticação do app fica separada; só precisamos do telefone para o WPP).
  const user = await prisma.users.create({
    data: {
      account_id: account.id,
      phone_number: PHONE,
      name: 'Matheus',
      role: 'admin',
      status: 'active'
    }
  });

  // Cartão de crédito de teste.
  const card = await prisma.financial_entities.create({
    data: {
      user_id: user.id,
      name: 'Nubank',
      type: 'credit_card',
      credit_limit: 5000,
      closing_day: 10,
      due_day: 20,
      color: 'from-purple-600 to-indigo-700'
    }
  });

  console.log('✅ Dados de teste criados:');
  console.log(`   Conta id=${account.id} (status=${account.status})`);
  console.log(`   Usuário id=${user.id} | ${user.name} | ${user.phone_number}`);
  console.log(`   Cartão id=${card.id} | ${card.name} | limite ${card.credit_limit} | fecha ${card.closing_day}/vence ${card.due_day}`);
}

main()
  .catch(err => { console.error('💥', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
