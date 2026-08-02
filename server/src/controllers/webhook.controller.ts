import type { Request, Response } from 'express';
import { checkEligibility } from '../services/agent/eligibility.service.js';
import { processMedia } from '../services/agent/media.service.js';
import { enqueueMessage } from '../services/agent/conversationBuffer.service.js';
import { processConversation } from '../services/agent/conversation.service.js';
import { EvolutionService } from '../services/evolution.service.js';
import type { IncomingMedia } from '../services/agent/media.service.js';
import type { WebhookMessage } from '../services/agent/types.js';

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
      raw: JSON.stringify(req.body)
    });
    if (debugLog.length > 5) debugLog.pop();

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
    if (!media) {
      // Tipo não reconhecido — avisa o usuário em vez de silenciar.
      console.warn('[webhook] Tipo de mensagem não reconhecido de', phone);
      await EvolutionService.sendText(phone, 'Recebi sua mensagem mas não consegui processar esse tipo de arquivo. Tente enviar como texto, imagem, PDF ou planilha. 😊');
      return;
    }

    // 3) Processa a mídia (transcreve áudio, descreve foto...) → texto.
    let message: WebhookMessage;
    try {
      message = await processMedia(userId, media, new Date());
    } catch (err) {
      console.error('[webhook] Erro ao processar mídia:', err);
      await EvolutionService.sendText(phone, 'Ops, tive um problema pra processar este arquivo. Pode tentar de novo? 😊');
      return;
    }

    // Se a mídia não foi processada com sucesso, avisa explicitamente.
    if (message.mediaType === 'unknown') {
      console.warn('[webhook] Mídia não processada:', message.text);
      await EvolutionService.sendText(
        phone,
        'Não consegui ler este arquivo. Se for uma foto de comprovante ou nota, tente enviar mais nítida. Se for um PDF ou planilha, posso tentar de novo. 😊'
      );
      return;
    }

    // 4) Coloca no buffer. Quando o usuário ficar 5s em silêncio, processa.
    enqueueMessage(phone, userId, message, async (flushedPhone, flushedUserId, messages) => {
      try {
        const reply = await processConversation(flushedUserId, messages, flushedPhone);
        await EvolutionService.sendText(flushedPhone, reply);
      } catch (err) {
        console.error('[webhook] Erro ao processar conversa:', err);
        await EvolutionService.sendText(
          flushedPhone,
          'Ops, tive um problema pra processar isso. Pode tentar de novo? Se for uma imagem ou documento, tente enviar como texto descrevendo o que precisa.'
        );
      }
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

  // Áudio. A Evolution pode enviar url pública, base64 ou streaming fields.
  if (message.audioMessage) {
    return { type: 'audio', url: extractMediaSource(message.audioMessage), rawMessage: { key: data.key, message } };
  }

  // Imagem.
  if (message.imageMessage) {
    return {
      type: 'image',
      url: extractMediaSource(message.imageMessage),
      text: message.imageMessage.caption,
      rawMessage: { key: data.key, message }
    };
  }

  // Documento/arquivo.
  if (message.documentMessage) {
    return {
      type: 'file',
      url: extractMediaSource(message.documentMessage),
      fileName: message.documentMessage.fileName,
      rawMessage: { key: data.key, message }
    };
  }

  // Algumas versões da Evolution enviam documento com caption aninhada.
  if (message.documentWithCaptionMessage?.message?.documentMessage) {
    const doc = message.documentWithCaptionMessage.message.documentMessage;
    return {
      type: 'file',
      url: extractMediaSource(doc),
      fileName: doc.fileName,
      rawMessage: { key: data.key, message }
    };
  }

  // Log de tipos não reconhecidos — ajuda a diagnosticar novos formatos.
  const msgTypes = Object.keys(message);
  console.warn('[webhook] Tipo de mensagem não reconhecido. Keys:', msgTypes.join(', '));

  return null;
}

/**
 * Extrai a fonte de uma mídia da Evolution, cobrindo 3 formatos possíveis:
 *  1. `url` pública (ex: https://evo.../file.mp3).
 *  2. `base64` (string pura ou com prefixo data:).
 *  3. Streaming fields (directPath/mediaKey) → sem fonte direta (retorna undefined).
 *
 * Para base64, devolve um data URL pronto para consumo (Whisper/vision aceitam).
 */
function extractMediaSource(media: any): string | undefined {
  if (!media) return undefined;

  // 1) URL pública direta.
  if (typeof media.url === 'string' && media.url.startsWith('http')) {
    return media.url;
  }

  // 2) Base64 (puro ou com prefixo data:).
  if (typeof media.base64 === 'string' && media.base64.length > 0) {
    const b64 = media.base64.startsWith('data:') ? media.base64 : `data:application/octet-stream;base64,${media.base64}`;
    return b64;
  }

  // 3) Sem fonte direta (streaming) — retorna undefined; o media.service trata.
  return undefined;
}
