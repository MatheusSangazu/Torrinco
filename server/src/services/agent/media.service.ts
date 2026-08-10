import axios from 'axios';
import * as llm from '../llm.service.js';
import { EvolutionService } from '../evolution.service.js';
import { classifyDoc, extractDocument } from './document.service.js';
import { sanitizeDocumentText } from '../action-safety.service.js';
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
  /** Objeto `message` completo do webhook, usado para baixar mídia via getBase64. */
  rawMessage?: any;
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
      try {
        const source = await resolveMediaSource(media);
        if (!source) return unknownMessage(userId, receivedAt, 'áudio sem fonte');
        const { buffer, name } = await resolveAudioBuffer(source);
        const transcription = await llm.transcribe(buffer, name);
        return {
          text: transcription,
          mediaType: 'audio',
          userId,
          receivedAt
        };
      } catch (err) {
        console.error('[media] Falha ao transcrever áudio:', err);
        return unknownMessage(userId, receivedAt, 'erro ao transcrever áudio');
      }
    }

    case 'image': {
      try {
        console.log('[media] Processando imagem...');
        const source = await resolveMediaSource(media);
        if (!source) {
          console.error('[media] Imagem sem fonte (getMediaBase64 falhou ou retornou null)');
          return unknownMessage(userId, receivedAt, 'imagem sem fonte');
        }
        console.log('[media] Fonte resolvida, chamando GPT-4o vision...');
        // GPT-4o vision aceita URL http OU data URL base64.
        const description = await llm.describeImage(source);
        console.log('[media] Descrição recebida:', description?.slice(0, 100));
        return {
          text: `[Imagem] ${description}`,
          mediaType: 'image',
          userId,
          receivedAt
        };
      } catch (err) {
        console.error('[media] Falha ao descrever imagem:', err);
        return unknownMessage(userId, receivedAt, 'erro ao descrever imagem');
      }
    }

    case 'file': {
      const fileName = media.fileName ?? 'documento';
      const kind = classifyDoc(fileName, media.url);
      if (kind === 'unknown') {
        return {
          text: `[Arquivo recebido] ${fileName}. Ainda não consigo ler este tipo de arquivo.`,
          mediaType: 'file',
          userId,
          receivedAt
        };
      }
      try {
        const source = await resolveMediaSource(media);
        if (!source) return unknownMessage(userId, receivedAt, `${fileName} sem fonte`);
        const buffer = await resolveFileBuffer(source);
        const doc = await extractDocument(buffer, fileName, kind);
        if (doc.empty) {
          return unknownMessage(
            userId,
            receivedAt,
            `${fileName} sem texto extraível (provavelmente é imagem/scanner)`
          );
        }
        if (doc.truncated) {
          return {
            text: `O arquivo ${fileName} é grande demais para uma leitura completa e segura pelo WhatsApp. Nenhum lançamento foi cadastrado. Envie uma versão menor ou use a Central de Importação no PWA.`,
            mediaType: 'text',
            userId,
            receivedAt
          };
        }
        // Sanitiza o texto do documento (proteção contra prompt injection)
        // e envolve em delimitadores para o LLM tratar como dados, não instruções.
        return {
          text: sanitizeDocumentText(fileName, doc.text),
          mediaType: kind === 'pdf' ? 'pdf' : 'file',
          userId,
          receivedAt
        };
      } catch (err) {
        console.error('[media] Falha ao ler documento:', err);
        return unknownMessage(userId, receivedAt, `erro ao ler ${fileName}`);
      }
    }

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
 * Resolve a fonte de mídia usando a melhor estratégia disponível:
 *  1. base64 já presente no webhook (raro, mas possível com webhook_base64=true).
 *  2. GET getBase64FromMediaMessage na Evolution (descriptografa o .enc).
 *  3. URL http pública direta (fallback).
 *
 * Retorna string pronta para uso: data URL base64 ou URL http.
 */
async function resolveMediaSource(media: IncomingMedia): Promise<string | null> {
  // 1) base64 direto do webhook.
  if (media.url?.startsWith('data:')) {
    return media.url;
  }
  // 2) Pede à Evolution para descriptografar via endpoint dedicado.
  if (media.rawMessage) {
    const b64 = await EvolutionService.getMediaBase64(media.rawMessage);
    if (b64) {
      // b64 é puro (sem prefixo); converte em data URL.
      // O mimetype default de áudio do WPP é ogg/opus; imagem é jpeg.
      const mime = media.type === 'audio' ? 'audio/ogg' : 'image/jpeg';
      return `data:${mime};base64,${b64}`;
    }
  }
  // 3) URL http pública (só funciona se a Evolution já tiver descriptografado).
  if (media.url?.startsWith('http') && !media.url.includes('.enc')) {
    return media.url;
  }
  return null;
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

/**
 * Resolve uma fonte (URL http OU data URL base64) para Buffer.
 * Usado para PDFs e outros arquivos.
 */
async function resolveFileBuffer(source: string): Promise<Buffer> {
  if (source.startsWith('data:')) {
    const b64 = source.split(',')[1] ?? '';
    return Buffer.from(b64, 'base64');
  }
  const response = await axios.get(source, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}
