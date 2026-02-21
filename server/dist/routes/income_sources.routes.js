import { Router } from 'express';
import { IncomeSourcesController } from '../controllers/income_sources.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
const router = Router();
router.use(authenticateJwt);
router.get('/', IncomeSourcesController.list);
router.post('/', IncomeSourcesController.create);
router.put('/:id', IncomeSourcesController.update);
router.delete('/:id', IncomeSourcesController.delete);
export default router;
//# sourceMappingURL=income_sources.routes.js.map