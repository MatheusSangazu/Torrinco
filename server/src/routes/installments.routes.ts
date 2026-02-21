import { Router } from 'express';
import { InstallmentsController } from '../controllers/installments.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', InstallmentsController.list);
router.get('/:id', InstallmentsController.getById);
router.post('/', InstallmentsController.create);
router.put('/:id/status', InstallmentsController.updateStatus);
router.delete('/:id', InstallmentsController.cancel);

export default router;
