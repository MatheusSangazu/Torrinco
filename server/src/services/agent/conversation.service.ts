import * as llm from '../llm.service.js';
import { TOOL_EXECUTORS, TOOL_DECLARATIONS } from './tools.js';
import { getHistory, appendToHistory } from './conversationHistory.service.js';
import type { WebhookMessage } from './types.js';

/**
 * Orquestra uma rodada de conversação (após o buffer estourar).
 *
 * Fluxo:
 *  1. Recupera o histórico da conversa (memória de 5 min por telefone).
 *  2. Chama o LLM com tools + histórico. Se ele pedir tools, executa e devolve
 *     o resultado para o modelo gerar a resposta final.
 *  3. Salva a interação no histórico e retorna o texto a enviar no WPP.
 *
 * O histórico permite perguntas de confirmação ("foi cartão ou dinheiro?") —
 * a resposta do usuário chega com contexto da pergunta anterior.
 */

const SYSTEM_PROMPT = `Você é o Torrinco, um assistente financeiro pessoal brasileiro que conversa pelo WhatsApp.

PERSONALIDADE:
- Amigável, direto e prestativo. Respostas curtas (WhatsApp), sem enrolação.
- Usa emojis com moderação (1-2 por mensagem quando fizer sentido).
- Sempre fala em reais (R$) e datas no formato DD/MM.

O QUE VOCÊ PODE FAZER (use as ferramentas):
- Registrar despesas (simples, parceladas no cartão, ou recorrentes).
- Registrar receitas.
- Consultar saldo e resumo do mês.
- Mostrar previsão do próximo mês.
- Listar próximos vencimentos (contas e faturas).
- Consultar e pagar faturas de cartão.

REGRAS PARA REGISTRAR GASTOS:
- Se o usuário disser o valor e a descrição mas NÃO disser a forma de pagamento, PERGUNTE antes de registrar: "Foi no cartão ou no dinheiro/Pix?"
  - Se disser "cartão" mas não disser qual, pergunte qual cartão.
  - Se disser "parcelado em Nx", confirme o valor total e o cartão.
- Se o usuário disser tudo claramente (valor + o que é + como pagou), registre direto sem perguntar.
- Para "comprei X em N vezes", use parcelas=N e valor=TOTAL (não o valor da parcela).
- Para "conta de Y reais todo mês", use recorrente com frequencia="monthly".
- Para receitas, se o usuário não disser a data, use a data de hoje (não pergunte).
- Depois de registrar, confirme de forma curta e clara (ex: "✅ Anotado! Mercado R$ 50 no dinheiro").
- Em saldos e valores, sempre formate como R$ X,XX.

OUTRAS REGRAS:
- Se uma ferramenta falhar (ex: cartão não encontrado), explique ao usuário o que houve.
- Não invente dados. Se não souber, diga e sugira usar o app.
- Você tem memória da conversa recente — use o contexto das mensagens anteriores para entender respostas curtas como "no nubank" ou "foi pix".`;

/**
 * Processa um conjunto de mensagens (do buffer) e retorna a resposta de texto.
 * Usa o telefone como chave do histórico.
 */
export async function processConversation(
  userId: number,
  messages: WebhookMessage[],
  phone?: string
): Promise<string> {
  // Junta o texto de todas as mensagens do buffer.
  const userText = messages.map(m => m.text).join('\n');

  // Recupera o histórico (se houver telefone).
  const history = phone ? getHistory(phone) : [];

  try {
    // 1ª rodada: o modelo decide se precisa de tools.
    const first = await llm.chatWithTools(SYSTEM_PROMPT, userText, TOOL_DECLARATIONS, history);

    // Sem tools → responde direto (pergunta, saudação, confirmação, etc.).
    if (first.toolCalls.length === 0) {
      const reply = first.content ?? 'Não entendi. Pode reformular? 😊';
      if (phone) appendToHistory(phone, userText, reply);
      return reply;
    }

    // Executa cada tool pedida.
    const toolResults: Array<{ id: string; name: string; result: any }> = [];
    for (const call of first.toolCalls) {
      const executor = TOOL_EXECUTORS.get(call.name);
      if (!executor) {
        toolResults.push({ id: call.id, name: call.name, result: { erro: `Ferramenta desconhecida: ${call.name}` } });
        continue;
      }
      try {
        const result = await executor(userId, call.arguments);
        toolResults.push({ id: call.id, name: call.name, result });
      } catch (err: any) {
        toolResults.push({ id: call.id, name: call.name, result: { erro: err?.message ?? 'erro interno' } });
      }
    }

    // 2ª rodada: o modelo gera a resposta final com base nos resultados.
    const finalReply = await llm.chatWithToolResults(
      SYSTEM_PROMPT,
      userText,
      TOOL_DECLARATIONS,
      toolResults,
      history
    );
    const reply = finalReply || 'Pronto! ✅';

    // Salva no histórico.
    if (phone) appendToHistory(phone, userText, reply);

    return reply;
  } catch (err) {
    console.error('[conversation] Erro no LLM:', err);
    return 'Ops, tive um problema para processar agora. Tente novamente em instantes. 🙏';
  }
}
