import { Router } from 'express';
import { UserDataController } from '../controllers/user_data.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

/**
 * Rotas de dados pessoais (LGPD).
 * - GET /export-data  → exportação completa (portabilidade).
 * - DELETE /account   → exclusão da conta (eliminação).
 */
const router = Router();

router.use(authenticateJwt);

router.get('/export-data', UserDataController.export);
router.delete('/account', UserDataController.requestDeletion);
router.get('/requests', UserDataController.listRequests);

export default router;
