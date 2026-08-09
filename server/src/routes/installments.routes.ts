import { Router } from 'express';
import { InstallmentsController } from '../controllers/installments.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { installmentSchemas, commonSchemas } from '../schemas/index.js';
import { requireFeature } from '../middleware/plan.js';

const router = Router();

router.use(authenticateJwt);
router.use(requireFeature('installments'));

router.get('/', validate({ query: installmentSchemas.listQuery }), InstallmentsController.list);
router.get('/:id', validate({ params: commonSchemas.idParams }), InstallmentsController.getById);
router.post('/', validate({ body: installmentSchemas.create }), InstallmentsController.create);
router.put('/:id/status', validate({ params: commonSchemas.idParams, body: installmentSchemas.updateStatus }), InstallmentsController.updateStatus);
router.delete('/:id', validate({ params: commonSchemas.idParams }), InstallmentsController.cancel);

export default router;
