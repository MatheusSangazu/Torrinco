/**
 * Teste de conversa de 2 turnos no MESMO processo (valida histórico).
 * Simula: usuário diz "gastei 50 no mercado" → IA pergunta → usuário responde "no nubank".
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import { processConversation } from '../src/services/agent/conversation.service.js';
import { clearHistory } from '../src/services/agent/conversationHistory.service.js';
import type { WebhookMessage } from '../src/services/agent/types.js';

async function main() {
  const user = await prisma.users.findFirst({
    where: { status: 'active' },
    select: { id: true, name: true, phone_number: true }
  });
  if (!user) { console.error('Sem usuário'); process.exit(1); }

  const phone = user.phone_number!;
  clearHistory(phone); // começa limpo

  const mkMsg = (text: string): WebhookMessage => ({
    text, mediaType: 'text', userId: user.id, receivedAt: new Date()
  });

  console.log('=== TURNO 1 ===');
  console.log('👤 "gastei 50 no mercado"');
  const r1 = await processConversation(user.id, [mkMsg('gastei 50 no mercado')], phone);
  console.log('🤖', r1);

  console.log('\n=== TURNO 2 ===');
  console.log('👤 "no nubank"');
  const r2 = await processConversation(user.id, [mkMsg('no nubank')], phone);
  console.log('🤖', r2);

  console.log('\n=== TURNO 3 (teste sem pagamento) ===');
  console.log('👤 "comprei um tênis de 300"');
  const r3 = await processConversation(user.id, [mkMsg('comprei um tenis de 300')], phone);
  console.log('🤖', r3);

  console.log('\n=== TURNO 4 (resposta) ===');
  console.log('👤 "dinheiro"');
  const r4 = await processConversation(user.id, [mkMsg('dinheiro')], phone);
  console.log('🤖', r4);
}

main().catch(console.error).finally(() => prisma.$disconnect());
