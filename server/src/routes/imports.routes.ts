import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authenticateJwt } from '../middleware/jwt.js';
import { ImportsController } from '../controllers/imports.controller.js';
import { IMPORT_MAX_FILE_BYTES } from '../services/financial-import-parser.service.js';

const router = Router();
const uploadLimiter = rateLimit({ windowMs: 15 * 60_000, max: 20, standardHeaders: true, legacyHeaders: false, message: { code: 'RATE_LIMITED', error: 'Muitos arquivos enviados. Aguarde alguns minutos e tente novamente.' } });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: IMPORT_MAX_FILE_BYTES, files: 1, fields: 5 } });

router.use(authenticateJwt);
router.use((_req, res, next) => process.env.IMPORT_CENTER_ENABLED === 'false' ? res.status(404).json({ code: 'FEATURE_DISABLED', error: 'A Central de Importação não está habilitada.' }) : next());
router.get('/', ImportsController.list);
router.post('/', uploadLimiter, upload.single('file'), ImportsController.upload);
router.get('/:id', ImportsController.get);
router.patch('/:id', ImportsController.update);
router.post('/:id/items', ImportsController.addItem);
router.patch('/:id/items/bulk', ImportsController.updateItemsBulk);
router.patch('/:id/items/:itemId', ImportsController.updateItem);
router.post('/:id/confirm', ImportsController.confirm);
router.post('/:id/cancel', ImportsController.cancel);

export default router;
