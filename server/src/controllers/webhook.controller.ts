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
export class WebhookController {
  static async evolution(req: Request, res: Response): Promise<void> {
    // ACK imediato — a Evolution não deve esperar o processamento.
    res.status(200).json({ received: true });

    const event = req.body?.event;
    const data = req.body?.data;

    // Só interessa mensagem recebida (não enviada, não status).
    // A Evolution usa eventos como "messages.upsert" com type "notify" para recebidas.
    if (event !== 'messages.upsert') return;

    const isFromMe = data?.key?.fromMe === true;
    const isGroup = !!data?.key?.remoteJid?.endsWith('@g.us');
    const phone = data?.key?.remoteJid?.replace('@s.whatsapp.net', '') ?? '';

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
