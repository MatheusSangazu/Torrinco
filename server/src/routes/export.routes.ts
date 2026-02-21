import { Router } from 'express';
import { ExportController } from '../controllers/export.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

router.use(authenticateJwt);

router.get('/excel', ExportController.exportToExcel);
router.post('/whatsapp', ExportController.sendReportToWhatsApp);

export default router;
