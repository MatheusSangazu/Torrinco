import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';

/**
 * Camada fina sobre a OpenAI. Isolada para permitir trocar de provedor no futuro.
 *
 * Expõe:
 *  - chat()          → resposta de texto simples.
 *  - chatWithTools() → function-calling: o modelo decide se chama uma tool.
 *  - transcribe()    → áudio → texto (Whisper).
 *  - describeImage() → imagem → descrição (GPT-4o vision).
 */

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

if (!client) {
  console.warn('⚠️ OPENAI_API_KEY não configurada — agente de IA desativado.');
}

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export interface ToolCallResult {
  /** Conteúdo de texto retornado (se houver). */
  content: string | null;
  /** Chamadas de tool solicitadas pelo modelo (se houver). */
  toolCalls: Array<{
    id: string;
    name: string;
    arguments: Record<string, any>;
  }>;
}

/** Chat simples (sem tools). */
export async function chat(
  systemPrompt: string,
  userMessage: string,
  history: ChatCompletionMessageParam[] = []
): Promise<string> {
  if (!client) throw new Error('LLM não configurado');
  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage }
    ]
  });
  return completion.choices[0]?.message?.content ?? '';
}

/** Chat com function-calling. Retorna texto e/ou chamadas de tool. */
export async function chatWithTools(
  systemPrompt: string,
  userMessage: string,
  tools: ChatCompletionTool[],
  history: ChatCompletionMessageParam[] = []
): Promise<ToolCallResult> {
  if (!client) throw new Error('LLM não configurado');
  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage }
    ],
    tools,
    tool_choice: 'auto'
  });

  const msg = completion.choices[0]?.message;
  const toolCalls = (msg?.tool_calls ?? [])
    .filter((tc): tc is Extract<typeof tc, { type: 'function' }> => tc.type === 'function')
    .map(tc => ({
      id: tc.id,
      name: tc.function.name,
      arguments: JSON.parse(tc.function.arguments || '{}')
    }));

  return {
    content: msg?.content ?? null,
    toolCalls
  };
}

/** Continua a conversa após executar as tools, devolvendo o resultado. */
export async function chatWithToolResults(
  systemPrompt: string,
  userMessage: string,
  tools: ChatCompletionTool[],
  toolResults: Array<{ id: string; name: string; result: any }>,
  history: ChatCompletionMessageParam[] = []
): Promise<string> {
  if (!client) throw new Error('LLM não configurado');
  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
      {
        role: 'assistant',
        content: null,
        tool_calls: toolResults.map(r => ({
          id: r.id,
          type: 'function',
          function: { name: r.name, arguments: JSON.stringify(r.result) }
        }))
      },
      ...toolResults.map(r => ({
        role: 'tool' as const,
        tool_call_id: r.id,
        content: JSON.stringify(r.result)
      }))
    ],
    tools
  });
  return completion.choices[0]?.message?.content ?? '';
}

/** Transcreve áudio (Whisper). Aceita URL pública ou base64 (com prefixo data). */
export async function transcribe(audioUrlOrBase64: string): Promise<string> {
  if (!client) throw new Error('LLM não configurado');
  const response = await client.audio.transcriptions.create({
    model: 'whisper-1',
    // @ts-expect-error: o SDK aceita string (URL) ou arquivo.
    file: audioUrlOrBase64
  });
  return response.text;
}

/** Descreve uma imagem via GPT-4o vision. Retorna descrição em PT-BR. */
export async function describeImage(imageUrl: string): Promise<string> {
  if (!client) throw new Error('LLM não configurado');
  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Descreva esta imagem de forma concisa em português brasileiro, focando em elementos relevantes para finanças (valor, descrição de produto, comprovante, nota fiscal, etc). Se for um comprovante, extraia valor, data e descrição.'
          },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ]
  });
  return completion.choices[0]?.message?.content ?? '';
}
