import { Router } from 'express';
import { GoogleController } from '../controllers/google.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

/**
 * Rotas de integração com Google Calendar.
 *
 * O callback é público (recebe o redirect do Google, sem sessão) — a resolução
 * do usuário vem do `state` assinado. connect/status exigem JWT (app/PWA).
 */
const router = Router();

// Público — chamado pelo Google após o consentimento.
router.get('/callback', GoogleController.callback);

// Autenticados — usados pelo app/PWA.
router.get('/connect', authenticateJwt, GoogleController.connect);
router.get('/status', authenticateJwt, GoogleController.status);
router.delete('/disconnect', authenticateJwt, GoogleController.disconnect);

export default router;
