import axios from 'axios';
import * as llm from '../llm.service.js';
import type { WebhookMessage } from './types.js';

/**
 * Tratamento de mídia — converte o que veio do WhatsApp em texto para o LLM.
 *
 * Espelha os galhos do fluxo n8n:
 *  - texto  → passa direto.
 *  - áudio  → transcreve via Whisper.
 *  - imagem → descreve via GPT-4o vision.
 *  - arquivo → descreve o tipo/nome (sem parsear conteúdo por enquanto).
 */

export interface IncomingMedia {
  type: 'text' | 'audio' | 'image' | 'file' | 'unknown';
  text?: string;
  /** URL pública ou base64 vinda do webhook da Evolution. */
  url?: string;
  fileName?: string;
}

/** Processa a mídia e devolve um WebhookMessage normalizado. */
export async function processMedia(
  userId: number,
  media: IncomingMedia,
  receivedAt: Date = new Date()
): Promise<WebhookMessage> {
  switch (media.type) {
    case 'text':
      return {
        text: media.text ?? '',
        mediaType: 'text',
        userId,
        receivedAt
      };

    case 'audio': {
      if (!media.url) return unknownMessage(userId, receivedAt, 'áudio sem URL');
      try {
        const transcription = await llm.transcribe(media.url);
        return {
          text: transcription,
          mediaType: 'audio',
          mediaUrl: media.url,
          userId,
          receivedAt
        };
      } catch (err) {
        console.error('[media] Falha ao transcrever áudio:', err);
        return unknownMessage(userId, receivedAt, 'erro ao transcrever áudio');
      }
    }

    case 'image': {
      if (!media.url) return unknownMessage(userId, receivedAt, 'imagem sem URL');
      try {
        const description = await llm.describeImage(media.url);
        return {
          text: `[Imagem] ${description}`,
          mediaType: 'image',
          mediaUrl: media.url,
          userId,
          receivedAt
        };
      } catch (err) {
        console.error('[media] Falha ao descrever imagem:', err);
        return unknownMessage(userId, receivedAt, 'erro ao descrever imagem');
      }
    }

    case 'file':
      return {
        text: `[Arquivo recebido] ${media.fileName ?? 'sem nome'}. Não consigo ler o conteúdo ainda.`,
        mediaType: 'file',
        mediaUrl: media.url,
        userId,
        receivedAt
      };

    default:
      return unknownMessage(userId, receivedAt, 'tipo de mídia não suportado');
  }
}

function unknownMessage(userId: number, receivedAt: Date, reason: string): WebhookMessage {
  return {
    text: `[Mídia não processada: ${reason}]`,
    mediaType: 'unknown',
    userId,
    receivedAt
  };
}

/**
 * Baixa uma mídia via URL da Evolution (quando vier como base64 ou endpoint).
 * Mantido para futuras extensões (ex: parsear PDF de comprovante).
 */
export async function downloadMedia(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}
