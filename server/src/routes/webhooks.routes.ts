import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';
import { verifyEvolutionSignature } from '../middleware/verifyWebhook.js';

/**
 * Webhooks da Evolution API.
 *
 * Auth dupla:
 *  - Assinatura HMAC-SHA256 (header X-Webhook-Signature) — só a Evolution
 *    consegue gerar, pois só ela tem o secret. Bloqueia qualquer outro emissor.
 *  - Validação de elegibilidade (telefone + plano) dentro do handler.
 *
 * IMPORTANTE: cadastrar este URL na instância da Evolution (Webhook URL)
 * configurando o mesmo EVOLUTION_WEBHOOK_SECRET em securityConfig.signatureSecret.
 */
const router = Router();

router.post('/evolution', verifyEvolutionSignature, WebhookController.evolution);
router.get('/debug', WebhookController.debug);

export default router;
