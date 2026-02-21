import { prisma } from '../src/lib/prisma.js';

async function migrateCategories() {
  console.log('Iniciando migração de categorias...');

  try {
    // 1. Buscar todas as transações que têm nome de categoria mas não têm category_id
    const transactions = await prisma.transactions.findMany({
      where: {
        category: { not: null },
        category_id: null
      }
    });

    console.log(`Encontradas ${transactions.length} transações para migrar.`);

    let migratedCount = 0;
    let createdCategoriesCount = 0;

    for (const transaction of transactions) {
      if (!transaction.category) continue;

      // Normalizar o nome da categoria
      const categoryName = transaction.category.trim();
      
      // Tentar encontrar uma categoria existente para este usuário e tipo
      let category = await prisma.categories.findFirst({
        where: {
          user_id: transaction.user_id,
          name: categoryName,
          type: transaction.type
        }
      });

      // Se não existir, criar
      if (!category) {
        // Definir uma cor padrão baseada no tipo
        const defaultColor = transaction.type === 'income' ? '#22c55e' : '#ef4444';
        
        category = await prisma.categories.create({
          data: {
            user_id: transaction.user_id,
            name: categoryName,
            type: transaction.type,
            color: defaultColor
          }
        });
        createdCategoriesCount++;
        console.log(`Categoria criada: ${categoryName} (${transaction.type}) para usuário ${transaction.user_id}`);
      }

      // Atualizar a transação com o ID da categoria
      await prisma.transactions.update({
        where: { id: transaction.id },
        data: { category_id: category.id }
      });

      migratedCount++;
    }

    console.log('Migração concluída com sucesso!');
    console.log(`Transações migradas: ${migratedCount}`);
    console.log(`Novas categorias criadas: ${createdCategoriesCount}`);

  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategories();
