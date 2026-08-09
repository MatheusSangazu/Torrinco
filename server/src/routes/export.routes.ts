import { Router } from 'express';
import { ExportController } from '../controllers/export.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { exportSchemas } from '../schemas/index.js';
import { requireFeature } from '../middleware/plan.js';

const router = Router();

router.use(authenticateJwt);
router.use(requireFeature('import'));

router.get('/excel', validate({ query: exportSchemas.query }), ExportController.exportToExcel);
router.post('/whatsapp', validate({ query: exportSchemas.query }), ExportController.sendReportToWhatsApp);

export default router;
