import { prisma } from '../lib/prisma.js';

/**
 * Cria contas beta (plano individual, 1 ano grátis) para a lista de amigos.
 * Idempotente: se o telefone já existe, pula.
 *
 * Rodar: npx tsx scripts/seed-beta-users.ts
 */
async function main() {
  const betaUsers = [
    { name: 'Matheus Henrique', phone: '557981003085' },
    { name: 'Kaua Costa',       phone: '557991392249' },
    { name: 'Vinicius',         phone: '557998737373' },
    { name: 'Ronie',            phone: '557999954473' },
    { name: 'Pedro',            phone: '553599167985' },
  ];

  const plan = await prisma.plans.findUnique({ where: { name: 'individual' } });
  if (!plan) {
    console.error('❌ Plano "individual" não encontrado. Rode: npx tsx scripts/seed-plans.ts');
    process.exit(1);
  }

  const trialEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 ano
  const defaultCategories = [
    { name: 'Salário', type: 'income', color: '#22c55e' },
    { name: 'Freelance', type: 'income', color: '#10b981' },
    { name: 'Investimentos', type: 'income', color: '#0ea5e9' },
    { name: 'Outros', type: 'income', color: '#64748b' },
    { name: 'Alimentação', type: 'expense', color: '#ef4444' },
    { name: 'Moradia', type: 'expense', color: '#f97316' },
    { name: 'Transporte', type: 'expense', color: '#eab308' },
    { name: 'Saúde', type: 'expense', color: '#ec4899' },
    { name: 'Educação', type: 'expense', color: '#3b82f6' },
    { name: 'Lazer', type: 'expense', color: '#8b5cf6' },
    { name: 'Compras', type: 'expense', color: '#f43f5e' },
    { name: 'Contas Fixas', type: 'expense', color: '#6366f1' },
  ];

  let created = 0;
  let skipped = 0;

  for (const u of betaUsers) {
    // Normaliza telefone: só dígitos.
    const phone = u.phone.replace(/\D/g, '');

    // Verifica se já existe (por qualquer variante de telefone).
    const existing = await prisma.users.findFirst({
      where: { phone_number: { contains: phone } }
    });

    if (existing) {
      console.log(`⏭️  ${u.name} (${phone}) já existe — pulando.`);
      skipped++;
      continue;
    }

    // Cria conta + usuário + categorias padrão em transação.
    await prisma.$transaction(async (tx) => {
      const account = await tx.accounts.create({
        data: {
          name: `${u.name}`,
          plan_id: plan.id,
          status: 'trial',
          trial_ends_at: trialEnd
        }
      });

      const user = await tx.users.create({
        data: {
          account_id: account.id,
          name: u.name,
          phone_number: phone,
          role: 'admin',
          status: 'active'
        }
      });

      // Categorias padrão da conta.
      await tx.categories.createMany({
        data: defaultCategories.map(c => ({
          account_id: account.id,
          name: c.name,
          type: c.type,
          color: c.color
        }))
      });

      console.log(`✅ ${u.name} (${phone}) — conta ${account.id}, user ${user.id}, trial até ${trialEnd.toLocaleDateString('pt-BR')}`);
      created++;
    });
  }

  console.log(`\n📊 Resumo: ${created} criados, ${skipped} pulados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
