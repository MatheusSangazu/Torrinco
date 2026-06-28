import type { Request, Response } from 'express';
import { checkEligibility } from '../services/agent/eligibility.service.js';
import { processMedia } from '../services/agent/media.service.js';
import { enqueueMessage } from '../services/agent/conversationBuffer.service.js';
import { processConversation } from '../services/agent/conversation.service.js';
import { EvolutionService } from '../services/evolution.service.js';
import type { IncomingMedia } from '../services/agent/media.service.js';

/**
 * Webhook da Evolution API.
 *
 * A Evolution dispara este endpoint para TODO evento (mensagem recebida,
 * enviada, status, etc). Aqui filtramos o que importa (mensagem recebida de
 * usuário elegível) e colocamos no buffer de conversação.
 *
 * O buffer agrega mensagens (debounce 5s) e, ao estourar, processa via LLM e
 * responde no WPP. Por isso o webhook sempre retorna 200 rápido (não bloqueia
 * a Evolution).
 */

// Acumula os últimos 20 payloads recebidos para diagnóstico.
const debugLog: Array<{ ts: string; event: string; eventKey: string; hasMessage: boolean; raw: any }> = [];

export class WebhookController {
  /** Log de debug — GET /webhooks/debug mostra os últimos payloads. */
  static debug(_req: Request, res: Response): void {
    res.json({ count: debugLog.length, payloads: debugLog });
  }

  static async evolution(req: Request, res: Response): Promise<void> {
    // ACK imediato — a Evolution não deve esperar o processamento.
    res.status(200).json({ received: true });

    const event = req.body?.event;
    const data = req.body?.data;

    // DEBUG: registra o payload bruto (primeiros níveis) para diagnóstico.
    const eventKey = data?.key?.remoteJid ?? data?.key?.id ?? 'sem-key';
    debugLog.unshift({
      ts: new Date().toISOString(),
      event: event ?? '(sem event)',
      eventKey: typeof eventKey === 'string' ? eventKey : JSON.stringify(eventKey),
      hasMessage: !!data?.message,
      raw: JSON.stringify(req.body).slice(0, 500)
    });
    if (debugLog.length > 20) debugLog.pop();

    // Só interessa mensagem recebida (não enviada, não status).
    // A Evolution usa eventos como "messages.upsert" com type "notify" para recebidas.
    if (event !== 'messages.upsert') return;

    const isFromMe = data?.key?.fromMe === true;
    // WhatsApp usa LID (@lid) como identificador primário; o número real fica
    // em remoteJidAlt (@s.whatsapp.net). Preferimos o número real quando existe.
    const rawJid =
      data?.key?.remoteJidAlt ??
      data?.key?.remoteJid ??
      '';
    const isGroup = !!rawJid.endsWith('@g.us');
    const phone = rawJid.replace('@s.whatsapp.net', '').replace('@lid', '');

    if (!phone || isGroup) return;

    // 1) Elegibilidade (telefone → user → plano ativo).
    const eligibility = await checkEligibility(phone, isFromMe, isGroup);
    if (!eligibility.ok) {
      // Loga motivos esperados em debug, sem poluir.
      if (eligibility.reason && !['self_message', 'group_message'].includes(eligibility.reason)) {
        console.log(`[webhook] Mensagem de ${phone} ignorada: ${eligibility.reason}`);
      }
      return;
    }
    const userId = eligibility.userId!;

    // 2) Classifica a mídia a partir da mensagem.
    const media = classifyMessage(data);
    if (!media) return; // tipo de evento/mídia não suportado

    // 3) Processa a mídia (transcreve áudio, descreve foto...) → texto.
    const message = await processMedia(userId, media, new Date());

    // 4) Coloca no buffer. Quando o usuário ficar 5s em silêncio, processa.
    enqueueMessage(phone, userId, message, async (flushedPhone, flushedUserId, messages) => {
      const reply = await processConversation(flushedUserId, messages, flushedPhone);
      await EvolutionService.sendText(flushedPhone, reply);
    });
  }
}

/**
 * Converte o payload da Evolution em um IncomingMedia.
 * A estrutura varia entre versões da Evolution; este parser cobre o padrão.
 */
function classifyMessage(data: any): IncomingMedia | null {
  const message = data?.message;
  if (!message) return null;

  // Texto.
  if (typeof message.conversation === 'string') {
    return { type: 'text', text: message.conversation };
  }
  if (typeof message.extendedTextMessage?.text === 'string') {
    return { type: 'text', text: message.extendedTextMessage.text };
  }

  // Áudio.
  if (message.audioMessage) {
    return {
      type: 'audio',
      url: message.audioMessage.url
    };
  }

  // Imagem.
  if (message.imageMessage) {
    return {
      type: 'image',
      url: message.imageMessage.url,
      text: message.imageMessage.caption
    };
  }

  // Documento/arquivo.
  if (message.documentMessage) {
    return {
      type: 'file',
      url: message.documentMessage.url,
      fileName: message.documentMessage.fileName
    };
  }

  return null;
}
