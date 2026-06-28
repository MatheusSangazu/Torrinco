import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

/**
 * Webhooks da Evolution API.
 *
 * Sem auth JWT — a Evolution chama diretamente. A validação de elegibilidade
 * (telefone cadastrado + plano ativo) acontece dentro do handler.
 *
 * IMPORTANTE: cadastrar este URL na instância da Evolution (Webhook URL):
 *   POST https://seu-servidor/webhooks/evolution
 */
const router = Router();

router.post('/evolution', WebhookController.evolution);
router.get('/debug', WebhookController.debug);

export default router;
