import * as llm from '../llm.service.js';
import { TOOL_EXECUTORS, TOOL_DECLARATIONS } from './tools.js';
import type { WebhookMessage } from './types.js';

/**
 * Orquestra uma rodada de conversação (após o buffer estourar).
 *
 * Fluxo:
 *  1. Monta o prompt de sistema (persona + contexto do app).
 *  2. Chama o LLM com tools. Se ele pedir tools, executa e devolve o resultado
 *     para o modelo gerar a resposta final em linguagem natural.
 *  3. Retorna o texto a enviar no WPP.
 *
 * Erros de tool são capturados e devolvidos ao modelo como falha, para ele
 * explicar ao usuário (ex: "cartão Nubank não encontrado") em vez de quebrar.
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

REGRAS:
- Se faltar informação essencial (ex: valor), pergunte antes de registrar.
- Para "comprei X em N vezes", use parcelas=N e valor=TOTAL.
- Para "conta de Y reais todo mês", use recorrente com frequencia="monthly".
- Depois de registrar algo, confirme de forma curta (ex: "✅ Anotado! Mercado R$ 50 no Nubank").
- Em saldos e valores, sempre formate como R$ X,XX.
- Se uma ferramenta falhar (ex: cartão não encontrado), explique ao usuário o que houve.
- Não invente dados. Se não souber, diga e sugira usar o app.`;

/**
 * Processa um conjunto de mensagens (do buffer) e retorna a resposta de texto.
 */
export async function processConversation(
  userId: number,
  messages: WebhookMessage[]
): Promise<string> {
  // Junta o texto de todas as mensagens do buffer.
  const userText = messages.map(m => m.text).join('\n');

  try {
    // 1ª rodada: o modelo decide se precisa de tools.
    const first = await llm.chatWithTools(SYSTEM_PROMPT, userText, TOOL_DECLARATIONS);

    // Sem tools → responde direto.
    if (first.toolCalls.length === 0) {
      return first.content ?? 'Não entendi. Pode reformular? 😊';
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
      toolResults
    );
    return finalReply || 'Pronto! ✅';
  } catch (err) {
    console.error('[conversation] Erro no LLM:', err);
    return 'Ops, tive um problema para processar agora. Tente novamente em instantes. 🙏';
  }
}
