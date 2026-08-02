import { prisma } from '../lib/prisma.js';

async function main() {
  console.log('🔄 Iniciando criação de categorias padrão para usuários existentes...');

  const users = await prisma.users.findMany({
    select: { id: true, name: true, account_id: true }
  });

  const defaultCategories = [
    // Receitas
    { name: 'Salário', type: 'income', color: '#22c55e' },
    { name: 'Freelance', type: 'income', color: '#10b981' },
    { name: 'Investimentos', type: 'income', color: '#0ea5e9' },
    { name: 'Presentes', type: 'income', color: '#8b5cf6' },
    { name: 'Outros', type: 'income', color: '#64748b' },
    
    // Despesas
    { name: 'Alimentação', type: 'expense', color: '#ef4444' },
    { name: 'Moradia', type: 'expense', color: '#f97316' },
    { name: 'Transporte', type: 'expense', color: '#eab308' },
    { name: 'Saúde', type: 'expense', color: '#ec4899' },
    { name: 'Educação', type: 'expense', color: '#3b82f6' },
    { name: 'Lazer', type: 'expense', color: '#8b5cf6' },
    { name: 'Compras', type: 'expense', color: '#f43f5e' },
    { name: 'Contas Fixas', type: 'expense', color: '#6366f1' }
  ];

  for (const user of users) {
    console.log(`👤 Verificando usuário ${user.name} (ID: ${user.id})...`);
    
    let createdCount = 0;

    for (const defaultCat of defaultCategories) {
      // Verificar se essa categoria específica já existe para o usuário
      const exists = await prisma.categories.findFirst({
        where: {
          account_id: user.account_id,
          name: defaultCat.name,
          type: defaultCat.type
        }
      });

      if (!exists) {
        await prisma.categories.create({
          data: {
            account_id: user.account_id,
            name: defaultCat.name,
            type: defaultCat.type,
            color: defaultCat.color
          }
        });
        createdCount++;
      }
    }

    if (createdCount > 0) {
      console.log(`✅ Adicionadas ${createdCount} novas categorias para ${user.name}.`);
    } else {
      console.log(`👌 Usuário ${user.name} já possui todas as categorias padrão.`);
    }
  }

  console.log('✅ Processo concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
