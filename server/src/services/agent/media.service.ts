import axios from 'axios';
import * as llm from '../llm.service.js';
import type { WebhookMessage } from './types.js';

/**
 * Tratamento de mídia — converte o que veio do WhatsApp em texto para o LLM.
 *
 * Espelha os galhos do fluxo n8n:
 *  - texto  → passa direto.
 *  - áudio  → transcreve via Whisper (baixa URL ou decodifica base64).
 *  - imagem → descreve via GPT-4o vision (URL ou data URL).
 *  - arquivo → descreve o tipo/nome (sem parsear conteúdo por enquanto).
 */

export interface IncomingMedia {
  type: 'text' | 'audio' | 'image' | 'file' | 'unknown';
  text?: string;
  /** URL pública (http) ou data URL base64 vinda do webhook da Evolution. */
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
      if (!media.url) return unknownMessage(userId, receivedAt, 'áudio sem fonte');
      try {
        const { buffer, name } = await resolveAudioBuffer(media.url);
        const transcription = await llm.transcribe(buffer, name);
        return {
          text: transcription,
          mediaType: 'audio',
          mediaUrl: media.url.startsWith('data:') ? undefined : media.url,
          userId,
          receivedAt
        };
      } catch (err) {
        console.error('[media] Falha ao transcrever áudio:', err);
        return unknownMessage(userId, receivedAt, 'erro ao transcrever áudio');
      }
    }

    case 'image': {
      if (!media.url) return unknownMessage(userId, receivedAt, 'imagem sem fonte');
      try {
        const description = await llm.describeImage(media.url);
        return {
          text: `[Imagem] ${description}`,
          mediaType: 'image',
          mediaUrl: media.url.startsWith('data:') ? undefined : media.url,
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
        mediaUrl: media.url?.startsWith('data:') ? undefined : media.url,
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
 * Resolve uma fonte de áudio (URL http OU data URL base64) para um Buffer + nome.
 * O Buffer é convertido em File pelo llm.transcribe usando o helper toFile do SDK.
 */
async function resolveAudioBuffer(source: string): Promise<{ buffer: Buffer; name: string }> {
  if (source.startsWith('data:')) {
    const match = source.match(/^data:([\w/+.-]+);base64,(.*)$/);
    const mime = match?.[1] ?? 'audio/ogg';
    const b64 = match?.[2] ?? source.split(',')[1] ?? '';
    const buf = Buffer.from(b64, 'base64');
    const ext = mime.includes('webm') ? 'webm' : mime.includes('mp3') ? 'mp3' : 'ogg';
    return { buffer: buf, name: `audio.${ext}` };
  }

  const response = await axios.get(source, { responseType: 'arraybuffer' });
  const mime = String(response.headers['content-type'] ?? 'audio/ogg');
  const ext = mime.includes('webm') ? 'webm' : mime.includes('mp3') ? 'mp3' : 'ogg';
  return { buffer: Buffer.from(response.data), name: `audio.${ext}` };
}

/**
 * Baixa uma mídia via URL da Evolution (utilitário para extensões futuras,
 * ex: parsear PDF de comprovante).
 */
export async function downloadMedia(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}
