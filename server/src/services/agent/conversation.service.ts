import * as llm from '../llm.service.js';
import { prisma } from '../../lib/prisma.js';
import { parseDate, todayUTC } from '../../lib/date-utils.js';
import { checkUserRateLimit } from '../../middleware/user-rate-limit.js';
import { TOOL_EXECUTORS, TOOL_DECLARATIONS } from './tools.js';
import { getHistory, appendToHistory } from './conversationHistory.service.js';
import type { WebhookMessage } from './types.js';
import {
  classifyRisk, createPendingAction, confirmPendingAction, cancelPendingAction,
  getLatestPending, markExecuted, recordDirectAction,
  getLatestActionForUndo, markUndone, buildImportPreview, computeIdempotencyKey,
} from '../action-safety.service.js';

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

CONTEXTO TEMPORAL:
- Hoje é: {{TODAY}} ({{WEEKDAY}}).
- Use esta data como referência para "ontem", "anteontem", "essa semana", etc.
- Para receitas/despesas sem data explícita, use hoje.

PERSONALIDADE:
- Amigável, direto e prestativo. Respostas curtas (WhatsApp), sem enrolação.
- Usa emojis com moderação (1-2 por mensagem quando fizer sentido).
- Sempre fala em reais (R$) e datas no formato DD/MM.

PRINCÍPIO DA VERDADE (INVIOLÁVEL):
- NUNCA afirme, negue ou invente informações sobre dados reais do usuário (transações, saldo, faturas, eventos da agenda, lembretes) sem antes consultar a ferramenta correspondente.
- Antes de editar, excluir ou responder sobre um item existente (ex: "muda o evento do banco"), CHAME a ferramenta de listagem/consulta ANTES para confirmar que o item existe e ver seus dados reais.
- Se a ferramenta não retornar o item esperado, seja honesto: "Não encontrei nenhum evento com esse nome. Quer que eu liste sua agenda?" — nunca finja que existe.
- Proibido alucinar valores, datas, saldos, nomes de transações ou eventos. Se não sabe, diga "deixa eu verificar" e chame a tool.
- Memória da conversa NÃO conta como fonte de verdade. Sempre consulte o sistema.

O QUE VOCÊ PODE FAZER (use as ferramentas):
- Registrar despesas (simples, parceladas no cartão, ou recorrentes).
- Registrar receitas.
- Consultar saldo e resumo do mês.
- Mostrar previsão do próximo mês.
- Listar próximos vencimentos (contas e faturas).
- Consultar e pagar faturas de cartão.
- Importar fatura em PDF (quando o usuário enviar um PDF de fatura do cartão).
- Listar cartões e contas do usuário.
- Excluir uma transação (apagar).
- Editar uma transação (corrigir descrição, valor, data, categoria ou forma de pagamento).
- Gerar relatório de gastos por categoria.
- Criar, listar e excluir lembretes (disparados no WhatsApp no horário).
- Gerenciar a agenda do Google: conectar, criar, listar e cancelar eventos.

REGRAS PARA PAGAMENTOS DE FATURA:
- Pagamento de fatura é quitação de dívida do cartão, não uma nova compra. Use pagar_fatura, nunca registrar_despesa, quando o usuário disser que pagou uma fatura.
- Se o usuário informar um valor, envie exatamente esse valor no campo valor; nunca substitua pelo total da fatura.
- Antes de pagar uma fatura ambígua, consulte a fatura/cartão. Se houver diferença entre o valor informado e o saldo, trate como pagamento parcial e informe o restante.
- Se o usuário disser apenas que "pagou a fatura inteira", omita o campo valor para quitar o saldo pendente da fatura mais antiga.
- Quando houver CONTEXTO DE LEMBRETE DE FATURA recente, respostas como "paguei tudo" ou "paguei R$ X" referem-se à fatura e ao bill_id desse contexto. Use esses dados ao chamar pagar_fatura.
- Se a resposta ao lembrete for "ainda não", não registre pagamento; apenas confirme que a fatura continuará pendente.
- Na virada do ciclo uma fatura fecha, mas nunca é marcada como paga automaticamente.

REGRAS PARA EXCLUIR/EDITAR:
- A EXCLUSÃO é gerenciada pelo backend: ao chamar excluir_transacao, o sistema cria uma ação pendente e retorna {pendente_confirmacao: true}. Você deve repassar o resumo e aguardar o usuário confirmar ("sim") ou cancelar ("não"). NÃO chame a ferramenta novamente ao confirmar.
- Para editar, confirme o que será alterado antes de executar.
- Se o usuário disser "apaga a última", use ultima=true.
- Se disser "apaga a do mercado", use descricao="mercado".
- Se não encontrar nenhuma transação com o critério, avise o usuário.

REGRAS PARA LEMBRETES:
- Para "em 5 minutos" ou "daqui a pouco", some ao horário atual. "Daqui a pouco" = +30 min.
- Para "mais tarde", use +2 horas.
- Se faltar horário, PERGUNTE ("Que horas quer ser lembrado?").
- Se faltar data para "once", use hoje.
- Para tarefas rápidas (remédio, lixo), use adicionar_lembrete.
- Depois de criar, confirme: "✅ Lembrete criado: [conteúdo] às [horário]".
- NUNCA invente regras sobre horários. Se o usuário pediu um horário específico (ex: 12h, meios-dia), use esse horário.

REGRAS PARA AGENDA (GOOGLE CALENDAR):
- Eventos vão direto para o Google Calendar (NÃO para os lembretes internos).
- NUNCA decida o status da conexão pela memória da conversa. O status pode ter mudado desde a última mensagem. SEMPRE chame a ferramenta (criar_evento, listar_eventos, etc.) e deixe ela verificar a conexão.
- Se a ferramenta retornar um objeto com o campo "url_autorizacao", significa que a agenda não está conectada. Você DEVE enviar essa URL COMPLETA e exatamente como veio (é uma URL longa do Google, começa com https://accounts.google.com/...). NUNCA substitua a URL por um placeholder como "[link]" ou "clique aqui".
- Se a ferramenta retornar "nao_conectado" mesmo após o usuário ter conectado, peça para reconectar (tokens expiram após 7 dias em modo de teste).
- Duração padrão se não informada: 1 hora (60 minutos).
- Para criar evento, use a data e o horário que o usuário JÁ informou na mensagem. Só PERGUNTE se realmente faltar um dos dois. NÃO repita/confirme dados que já foram fornecidos.
- Para EDITAR evento (mudar horário, data, título), use a ferramenta editar_evento. Quando o usuário pedir uma mudança CLARA (ex: "muda o horário para 11h"), execute direto sem pedir confirmação.
- Para "amanhã", "hoje", "próxima segunda" etc., use a data de referência do contexto.
- Depois de criar/editar, confirme de forma curta (ex: "✅ Evento alterado para amanhã às 11h.").
- Para listar, use listar_eventos com a data/período. Formate os resultados de forma legível.
- Para cancelar, SEMPRE confirme antes, igual à exclusão de transação.
- NUNCA diga que fez algo que não fez. Só confirme uma ação após a ferramenta retornar sucesso.

PROTOCOLO DE DOCUMENTOS (PDF / PLANILHA / EXCEL / CSV):
- Quando receber uma mensagem começando com "[Documento:", você recebeu o texto extraído de um arquivo enviado pelo usuário (o nome do arquivo vem junto).
- Aja em SILÊNCIO: NÃO responda antes de processar.
- IDENTIFIQUE o tipo de documento pelo conteúdo E pelo nome do arquivo. Nunca assuma que é fatura só porque é PDF — pode ser boleto, extrato, comprovante, planilha, recibo, etc.

TRATAMENTO POR TIPO (você decide qual se aplica):

1) FATURA DE CARTÃO:
   - Identifique cada transação/compra (descrição + valor + data se houver).
   - IGNORE linhas de "Pagamento recebido" / "Payment received" / "Pagamento da fatura" — são pagamentos que o usuário fez pra quitar faturas anteriores, NÃO são despesas novas. Registrá-las seria conta dupla.
   - Valores negativos que representem estorno ou crédito DEVEM aparecer na prévia como receita/crédito. Não os descarte silenciosamente.
   - Chame registrar_despesa para CADA compra restante, usando o cartão correspondente.
   - Se o nome do cartão não estiver claro, PERGUNTE antes de registrar.
   - Resumo final: "✅ Importei N transações da fatura do [cartão]." — NÃO informe o total em dinheiro. Você (LLM) não consegue somar valores com precisão, então informar um total inventado é desonesto. Se o usuário quiser o total, sugira que ele pergunte "quanto gastei neste cartão?" pra ser calculado pelo sistema.

2) BOLETO / CONTA:
   - Identifique beneficiário, valor, vencimento e descrição.
   - PERGUNTE: "Você já pagou esse boleto de *R$ X*?" antes de registrar.
   - Se sim → registrar_despesa (forma_pagamento conforme resposta, default pix).
   - Se não → pergunte se quer apenas agendar um lembrete (adicionar_lembrete) para o vencimento.
   - Não registre como despesa sem confirmação.

3) EXTRATO BANCÁRIO:
   - Pode conter entradas (receitas) e saídas (despesas) misturadas.
   - Identifique colunas de data, descrição e valor (negativo = despesa, positivo = receita).
   - Antes de importar em massa, AVISE: "Encontrei N transações no extrato. Quer que eu importe todas?"
   - Após confirmação, registre respeitando o sinal (receita → registrar_receita, despesa → registrar_despesa).
   - Resumo final: "✅ Importei N transações do extrato (R receitas, S despesas)."

4) COMPROVANTE DE PIX/TRANSFERÊNCIA:
   - Identifique valor, destinatário/remetente e data.
   - Confirme antes de registrar: "Encontrei um comprovante de R$ X para [destinatário] em [data]. Quer registrar como despesa?"
   - Use o tipo correto (receita se você recebeu, despesa se enviou).

5) DOCUMENTO NÃO RECONHECIDO:
   - Se não souber identificar, seja honesto: "Recebi o arquivo [nome] mas não consegui entender o que é. Pode me explicar o que faço com ele?"

REGRAS GERAIS:
- Para qualquer documento que envolva dinheiro saindo, CONFIRME antes de registrar.
- Se o documento estiver truncado ou incompleto, NÃO registre nenhum item. Informe que é necessário enviar uma versão menor ou usar a Central de Importação no PWA.
- Se não houver texto (imagem/scanner), avise: "Não consegui ler esse arquivo. Tente enviar como PDF de texto ou planilha."
- NUNCA informe totais em dinheiro que você mesmo somou. Você (LLM) erra aritmética. Para totais, diga apenas a CONTAGEM de itens ("Importei N transações") e deixe o sistema calcular o valor quando o usuário perguntar.
- Sempre mostre um RESUMO no final do que foi importado, com a CONTAGEM em *negrito* (não o total em dinheiro).

REGRAS PARA REGISTRAR GASTOS:
- Se o usuário disser o valor e a descrição mas NÃO disser a forma de pagamento, PERGUNTE antes de registrar: "Foi no cartão de crédito, débito, dinheiro ou Pix?"
- Mapeie a resposta do usuário assim:
  - "cartão de crédito" / "crédito" / nome do cartão → use o campo "cartao" com o nome do cartão. NÃO use forma_pagamento.
  - "cartão de débito" / "débito" → use forma_pagamento="debito".
  - "pix" / "transferência" / "dinheiro" / "boleto" → use forma_pagamento="pix".
- Se disser "cartão" mas não disser qual, pergunte qual cartão (só para crédito).
- Se disser "parcelado em Nx", confirme o valor total e o cartão de crédito.
- Para "comprei X em N vezes", use parcelas=N e valor=TOTAL (não o valor da parcela).
- Para "conta de Y reais todo mês", use recorrente com frequencia="monthly".
- Para receitas, se o usuário não disser a data, use a data de hoje (não pergunte).
- Depois de registrar, confirme de forma curta e clara (ex: "✅ Anotado! Mercado R$ 50 no Pix").
- Em saldos e valores, sempre formate como R$ X,XX e coloque em *negrito* no WhatsApp (ex: *R$ 50,00*).
- O WhatsApp usa *asteriscos* para negrito. Use para valores, datas importantes e saldos.

DESAMBIGUAÇÃO DE CARTÕES (MUITO IMPORTANTE):
- As ferramentas podem retornar {ambiguo: true, mensagem: "..."} quando o nome do cartão bate com mais de um (ex: "Nubank" casa com "Nubank" e "Nubank Gold").
- Quando receber ambiguo, NÃO registre/altere nada. Repasse a "mensagem" pro usuário e pergunte qual cartão ele quer.
- Ex: tool retorna "Encontrei mais de um cartão: Nubank, Nubank Gold. Qual deles?" → repasse exatamente isso.
- Na resposta do usuário, use o nome COMPLETO exato que ele escolheu como campo "cartao" na próxima chamada.
- Se a tool retornar {erro: "Não encontrei nenhum cartão..."}, sugira usar listar_cartoes pra ver as opções.

OUTRAS REGRAS:
- Se uma ferramenta falhar (ex: cartão não encontrado), explique ao usuário o que houve.
- Nunca invente valores nem estime dados. Se não souber, diga e sugira usar o app.
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
  // Rate limit por usuário — protege contra abuso.
  const limit = checkUserRateLimit(userId);
  if (!limit.allowed) {
    const minutos = Math.ceil(limit.retryInMs / 60000);
    return `Você enviou muitas mensagens em pouco tempo 😅 Aguarde ${minutos} min e tente de novo.`;
  }

  const userText = messages.map(m => m.text).join('\n');
  const history = phone ? getHistory(phone) : [];

  // Busca account_id do usuário para validação de tenant.
  const userRec = await prisma.users.findUnique({
    where: { id: userId },
    select: { account_id: true },
  });
  const accountId = userRec?.account_id ?? 0;

  // ── Verifica se o usuário está confirmando/cancelando uma ação pendente ──
  const textLower = userText.toLowerCase().trim();
  const isUndo = /^(desfazer|undo|voltar|reverter|cancelar ultima|cancelar última)/.test(textLower);
  const isConfirm = /^(sim|pode|confirmo|isso|exato|correto|ok|claro|com certeza|pode apagar|pode excluir|pode fazer|confirmar)/.test(textLower);
  const isCancel = /^(não|nao|cancelar|cancela|deixa|esquece|não pode|nao pode)/.test(textLower);

  if (isUndo) {
    const undoableTypes = ['registrar_despesa', 'registrar_receita', 'editar_transacao'] as const;
    for (const t of undoableTypes) {
      const record = await getLatestActionForUndo(userId, accountId, t);
      if (record) {
        const ok = await undoFromAudit(userId, record.beforeState, record.afterState, t);
        if (ok) {
          await markUndone(record.id);
          const reply = '✅ Desfeito.';
          if (phone) appendToHistory(phone, userText, reply);
          return reply;
        }
      }
    }

    const reply = 'Não encontrei nenhuma ação recente para desfazer.';
    if (phone) appendToHistory(phone, userText, reply);
    return reply;
  }

  if (isConfirm || isCancel) {
    const pending = await getLatestPending(userId, accountId);
    if (pending) {
      if (isCancel) {
        await cancelPendingAction(pending.id, userId, accountId);
        const reply = '✅ Ação cancelada.';
        if (phone) appendToHistory(phone, userText, reply);
        return reply;
      }
      // Confirmar: busca o executor e executa a ação.
      const confirmResult = await confirmPendingAction(pending.id, userId, accountId);
      if (!confirmResult.ok) {
        const reply = confirmResult.error ?? 'Não consegui confirmar esta ação.';
        if (phone) appendToHistory(phone, userText, reply);
        return reply;
      }
      if (confirmResult.error === 'já executada') {
        const reply = 'Esta ação já foi executada anteriormente.';
        if (phone) appendToHistory(phone, userText, reply);
        return reply;
      }
      if (confirmResult.payload) {
        try {
          if (pending.actionType === 'bulk_import') {
            const result = await executeBulkImport(userId, accountId, confirmResult.payload);
            await markExecuted(pending.id, userId, accountId, result);
            const reply = `✅ Importação concluída. ${result.ok ? `Registros importados: ${result.imported}` : ''}`;
            if (phone) appendToHistory(phone, userText, reply);
            return reply;
          }

          const executor = TOOL_EXECUTORS.get(pending.actionType);
          if (!executor) {
            const reply = 'Não encontrei a ferramenta para executar esta ação confirmada.';
            if (phone) appendToHistory(phone, userText, reply);
            return reply;
          }

          const result = await executor(userId, confirmResult.payload);
          await markExecuted(pending.id, userId, accountId, result);
          const reply = `✅ Confirmado e executado: ${pending.summary}`;
          if (phone) appendToHistory(phone, userText, reply);
          return reply;
        } catch (err: any) {
          console.error('[safety] Erro ao executar ação confirmada:', err?.message);
          const reply = 'Ops, ocorreu um erro ao executar. Tente novamente.';
          if (phone) appendToHistory(phone, userText, reply);
          return reply;
        }
      }
    }
  }

  // Injeta a data atual no prompt (timezone São Paulo).
  const now = new Date();
  const today = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  const weekday = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long' });
  let systemPrompt = SYSTEM_PROMPT.replace('{{TODAY}}', today).replace('{{WEEKDAY}}', weekday);
  const recentBillReminder = await prisma.reminder_deliveries?.findFirst?.({
    where: {
      user_id: userId,
      source_type: 'card_bill_due',
      status: 'sent',
      sent_at: { gte: new Date(now.getTime() - 48 * 60 * 60_000) }
    },
    orderBy: { sent_at: 'desc' }
  });
  if (recentBillReminder) {
    const remindedBill = await prisma.card_bills.findFirst({
      where: { id: Number(recentBillReminder.source_id), user_id: userId },
      include: { financial_entities: { select: { name: true } } }
    });
    if (remindedBill) {
      systemPrompt += `\n\nCONTEXTO DE LEMBRETE DE FATURA RECENTE:\n- Cartão: ${remindedBill.financial_entities.name}\n- bill_id: ${remindedBill.id}\n- O agente perguntou hoje se esta fatura foi paga. Use este contexto somente se a mensagem atual parecer uma resposta a essa pergunta.`;
    }
  }

  try {
    // 1ª rodada: o modelo decide se precisa de tools.
    const first = await llm.chatWithTools(systemPrompt, userText, TOOL_DECLARATIONS, history);

    // Sem tools → responde direto.
    if (first.toolCalls.length === 0) {
      const reply = first.content ?? 'Não entendi. Pode reformular? 😊';
      if (phone) appendToHistory(phone, userText, reply);
      return reply;
    }

    const hasDocument = messages.some(m => m.mediaType === 'pdf' || m.mediaType === 'file');
    if (hasDocument) {
      const mutatingCalls = first.toolCalls.filter(c =>
        c.name === 'registrar_despesa' || c.name === 'registrar_receita'
      ).map(c => ({ name: c.name, arguments: c.arguments }));

      if (mutatingCalls.length > 0) {
        const deduped = await filterWhatsAppImportDuplicates(accountId, mutatingCalls);
        const selectedCalls = deduped.calls;
        const preview = buildImportPreview(selectedCalls);
        if (selectedCalls.length === 0) {
          const reply = `Os ${mutatingCalls.length} lançamentos encontrados já parecem estar cadastrados. Nenhuma duplicidade foi criada.`;
          if (phone) appendToHistory(phone, userText, reply);
          return reply;
        }
        const idempotencyKey = computeIdempotencyKey(`${accountId}:${userId}:${userText}`);

        let pendingId: number | null = null;
        try {
          const pending = await createPendingAction({
            userId,
            accountId,
            actionType: 'bulk_import',
            payload: { toolCalls: selectedCalls, idempotencyKey },
            idempotencyKey,
            summary: `Importar ${preview.count} lançamentos do documento (${deduped.duplicates} duplicidades ignoradas)`,
          });
          if (pending.status === 'executed') {
            const reply = 'Este documento já foi confirmado anteriormente. Nenhum lançamento duplicado foi criado.';
            if (phone) appendToHistory(phone, userText, reply);
            return reply;
          }
          pendingId = pending.id;
        } catch (err: any) {
          console.error('[import] erro ao criar pendência:', err?.message);
        }

        const reply = pendingId
          ? `Encontrei ${mutatingCalls.length} lançamentos no documento. Serão cadastrados ${preview.count}; duplicidades ignoradas: ${deduped.duplicates}. Total selecionado: ${formatBRL(preview.total)}. Quer importar? Responda *sim* para gravar ou *não* para cancelar.`
          : `Encontrei ${mutatingCalls.length} lançamentos no documento, mas não consegui criar a confirmação da importação. Tente novamente.`;

        if (phone) appendToHistory(phone, userText, reply);
        return reply;
      }
    }

    // ── Executa cada tool com camada de segurança ──
    const toolResults: Array<{ id: string; name: string; result: any }> = [];
    for (const call of first.toolCalls) {
      const executor = TOOL_EXECUTORS.get(call.name);
      if (!executor) {
        toolResults.push({ id: call.id, name: call.name, result: { erro: `Ferramenta desconhecida: ${call.name}` } });
        continue;
      }

      // Classifica o risco da ação.
      const risk = classifyRisk(call.name, call.arguments);

      if (risk.level === 'needs_confirmation') {
        // Cria ação pendente em vez de executar.
        const pending = await createPendingAction({
          userId,
          accountId,
          actionType: call.name,
          payload: call.arguments,
          summary: risk.summary,
        });
        toolResults.push({
          id: call.id,
          name: call.name,
          result: {
            pendente_confirmacao: true,
            id_acao: pending.id,
            resumo: risk.summary,
            mensagem: `${risk.summary}. Confirmar? Responda *sim* para executar ou *não* para cancelar.`,
          },
        });
        continue;
      }

      // Ação safe: executa diretamente.
      try {
        // Captura estado anterior para auditoria (para operações mutáveis).
        let beforeState: Record<string, any> | undefined;
        if (call.name === 'editar_transacao') {
          beforeState = await captureTransactionBeforeState(userId, call.arguments);
        }

        const result = await executor(userId, call.arguments);
        console.log(`[tool] ${call.name} OK`);

        // Registra auditoria para ações que modificam dados.
        if (isMutating(call.name)) {
          await recordDirectAction(userId, accountId, call.name, beforeState ?? {}, result ?? {});
        }

        toolResults.push({ id: call.id, name: call.name, result });
      } catch (err: any) {
        console.error(`[tool] ${call.name} ERRO:`, err?.message);
        toolResults.push({ id: call.id, name: call.name, result: { erro: err?.message ?? 'erro interno' } });
      }
    }

    // 2ª rodada: o modelo gera a resposta final com base nos resultados.
    const finalReply = await llm.chatWithToolResults(
      systemPrompt,
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

// ── Helpers ───────────────────────────────────────────────────────

/** Ferramentas que modificam dados (para auditoria). */
const MUTATING_TOOLS = new Set([
  'registrar_despesa', 'registrar_receita', 'editar_transacao',
  'pagar_fatura', 'adicionar_lembrete',
]);

function isMutating(toolName: string): boolean {
  return MUTATING_TOOLS.has(toolName);
}

/**
 * Captura o estado anterior de uma transação antes da edição (para auditoria/desfazer).
 */
async function captureTransactionBeforeState(
  userId: number,
  args: Record<string, any>,
): Promise<Record<string, any>> {
  let where: any = { user_id: userId, deleted_at: null };
  if (args.id) where.id = Number(args.id);
  else if (args.descricao) where.description = { contains: args.descricao };
  const tx = await prisma.transactions.findFirst({
    where,
    orderBy: { id: 'desc' },
    select: {
      id: true, description: true, amount: true, type: true,
      transaction_date: true, payment_method: true, category: true, category_id: true, entity_id: true,
    },
  });
  return tx ?? {};
}

function formatBRL(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

async function undoFromAudit(
  userId: number,
  beforeState: Record<string, any>,
  afterState: Record<string, any>,
  actionType: string,
): Promise<boolean> {
  if (actionType === 'registrar_despesa' || actionType === 'registrar_receita') {
    const kind = afterState.kind;
    const txId = afterState?.transaction?.id ?? afterState?.transaction?.id;
    if (!txId || (kind !== 'expense' && kind !== 'income')) return false;

    await prisma.transactions.update({
      where: { id: Number(txId) },
      data: { deleted_at: new Date() },
    });
    return true;
  }

  if (actionType === 'editar_transacao') {
    const id = beforeState.id;
    if (!id) return false;

    await prisma.transactions.update({
      where: { id: Number(id) },
      data: {
        description: beforeState.description ?? null,
        amount: beforeState.amount ?? null,
        transaction_date: beforeState.transaction_date ?? null,
        payment_method: beforeState.payment_method ?? null,
        category: beforeState.category ?? null,
        category_id: beforeState.category_id ?? null,
        entity_id: beforeState.entity_id ?? null,
      },
    });
    return true;
  }

  return false;
}

async function filterWhatsAppImportDuplicates(
  accountId: number,
  calls: Array<{ name: string; arguments: Record<string, any> }>,
): Promise<{ calls: Array<{ name: string; arguments: Record<string, any> }>; duplicates: number }> {
  const normalize = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const selected: typeof calls = []; const seen = new Set<string>(); let duplicates = 0;
  for (const call of calls) {
    const args = call.arguments ?? {}; const description = String(args.descricao ?? '').trim(); const amount = Number(args.valor);
    let date: Date; try { date = args.data ? parseDate(String(args.data)) : todayUTC(); } catch { selected.push(call); continue; }
    const type = call.name === 'registrar_receita' ? 'income' : 'expense';
    let entityId: number | null = null;
    if (args.cartao) {
      const cards = await prisma.financial_entities.findMany({ where: { account_id: accountId, type: 'credit_card', name: { contains: String(args.cartao).trim() } }, select: { id: true, name: true } });
      if (cards.length === 1) entityId = cards[0]!.id;
    }
    const key = `${date.toISOString().slice(0, 10)}|${amount.toFixed(2)}|${normalize(description)}|${type}|${entityId ?? 'none'}`;
    if (seen.has(key)) { duplicates++; continue; }
    seen.add(key);
    const start = new Date(date); start.setUTCHours(0, 0, 0, 0); const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1);
    const matches = await prisma.transactions.findMany({ where: { account_id: accountId, entity_id: entityId, type, amount, deleted_at: null, transaction_date: { gte: start, lt: end } }, select: { description: true } });
    if (matches.some(item => normalize(item.description) === normalize(description))) { duplicates++; continue; }
    selected.push(call);
  }
  return { calls: selected, duplicates };
}

async function executeBulkImport(
  userId: number,
  accountId: number,
  payload: Record<string, any>,
): Promise<{ ok: boolean; imported: number; errors: number }> {
  const toolCalls: Array<{ name: string; arguments: Record<string, any> }> = payload.toolCalls ?? [];
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
    return { ok: false, imported: 0, errors: 1 };
  }

  const result = await prisma.$transaction(async (tx) => {
    let imported = 0;
    let errors = 0;

    for (const call of toolCalls) {
      if (call.name !== 'registrar_despesa' && call.name !== 'registrar_receita') {
        errors++;
        throw new Error('IMPORT_INVALID_TOOL');
      }

      const args = call.arguments ?? {};
      if (args.recorrente || (args.parcelas && Number(args.parcelas) > 1)) {
        errors++;
        throw new Error('IMPORT_REQUIRES_CONFIRMATION');
      }

      const description = String(args.descricao ?? '').trim();
      const amount = Number(args.valor);
      const date = args.data ? parseDate(String(args.data)) : todayUTC();
      if (!description || !Number.isFinite(amount)) {
        errors++;
        throw new Error('IMPORT_INVALID_ROW');
      }

      const type = call.name === 'registrar_despesa' ? 'expense' : 'income';
      const categoryName = args.categoria ? String(args.categoria).trim() : null;

      let categoryId: number | null = null;
      let categoryFinal: string | null = null;
      if (categoryName) {
        const existing = await tx.categories.findFirst({
          where: { account_id: accountId, type, name: { equals: categoryName } },
        });
        if (existing) {
          categoryId = existing.id;
          categoryFinal = existing.name;
        } else {
          const created = await tx.categories.create({
            data: { account_id: accountId, type, name: categoryName },
          });
          categoryId = created.id;
          categoryFinal = created.name;
        }
      }

      let entityId: number | null = null;
      let paymentMethod = args.forma_pagamento ? String(args.forma_pagamento) : 'pix';
      if (type === 'expense' && args.cartao) {
        const cardName = String(args.cartao).trim();
        const card = await tx.financial_entities.findFirst({
          where: { account_id: accountId, type: 'credit_card', name: { equals: cardName } },
        });
        if (!card) throw new Error('IMPORT_CARD_NOT_FOUND');
        entityId = card.id;
        paymentMethod = 'credit';
      }

      await tx.transactions.create({
        data: {
          account_id: accountId,
          user_id: userId,
          entity_id: entityId,
          amount,
          type,
          status: 'paid',
          category: categoryFinal,
          category_id: categoryId,
          description,
          transaction_date: date,
          payment_method: paymentMethod,
        },
      });
      imported++;
    }

    return { ok: true, imported, errors };
  });

  return result;
}
