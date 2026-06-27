/**
 * Teste isolado do "cérebro" do agente (Nível 1).
 *
 * Roda uma mensagem fake pela conversation.service → LLM + tools + banco.
 * Não precisa de WhatsApp nem Evolution. Valida que:
 *   - OPENAI_API_KEY funciona.
 *   - O modelo escolhe a tool certa.
 *   - A tool executa e grava no banco.
 *
 * Uso:  npx tsx scripts/test-agent.ts
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import { processConversation } from '../src/services/agent/conversation.service.js';
import type { WebhookMessage } from '../src/services/agent/types.js';

async function main() {
  // 1) Pega o primeiro usuário ativo para testar.
  const user = await prisma.users.findFirst({
    where: { status: 'active' },
    include: { accounts: true }
  });
  if (!user) {
    console.error('❌ Nenhum usuário ativo encontrado no banco.');
    process.exit(1);
  }
  console.log(`👤 Testando com usuário: ${user.name ?? user.phone_number} (id=${user.id})`);

  // 2) Lista cartões do usuário (para a IA ter contexto se pedir cartão).
  const cards = await prisma.financial_entities.findMany({
    where: { user_id: user.id, type: 'credit_card' },
    select: { name: true }
  });
  console.log('💳 Cartões cadastrados:', cards.map(c => c.name).join(', ') || '(nenhum)');

  // 3) Mensagem de teste.
  const testText = process.argv[2] ?? 'gastei 50 no mercado';
  console.log(`\n📩 Mensagem simulada: "${testText}"\n`);

  const message: WebhookMessage = {
    text: testText,
    mediaType: 'text',
    userId: user.id,
    receivedAt: new Date()
  };

  // 4) Processa (passa o telefone para manter histórico entre chamadas).
  console.log('🧠 Processando (pode levar alguns segundos)...');
  const reply = await processConversation(user.id, [message], user.phone_number ?? 'test');

  console.log('\n🤖 Resposta do agente:');
  console.log(reply);
}

main()
  .catch(err => {
    console.error('💥 Erro:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
