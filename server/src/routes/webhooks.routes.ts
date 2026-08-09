import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';
import { verifyEvolutionApiKey } from '../middleware/verifyWebhook.js';

/**
 * Webhooks da Evolution API.
 *
 * Auth via API Key (header `apikey`) — a Evolution envia automaticamente em
 * todos os webhooks. Validada em verifyEvolutionApiKey.
 *
 * IMPORTANTE: configurar EVOLUTION_WEBHOOK_API_KEY no .env com o MESMO valor
 * usado como API key na Evolution (global AUTHENTICATION_API_KEY ou token
 * da instância).
 */
const router = Router();

router.post('/evolution', verifyEvolutionApiKey, WebhookController.evolution);

export default router;
