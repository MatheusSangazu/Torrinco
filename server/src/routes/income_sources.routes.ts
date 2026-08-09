import { Router } from 'express';
import { IncomeSourcesController } from '../controllers/income_sources.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { incomeSourceSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', IncomeSourcesController.list);
router.post('/', validate({ body: incomeSourceSchemas.create }), IncomeSourcesController.create);
router.put('/:id', validate({ params: commonSchemas.idParams, body: incomeSourceSchemas.update }), IncomeSourcesController.update);
router.delete('/:id', validate({ params: commonSchemas.idParams }), IncomeSourcesController.delete);

export default router;
