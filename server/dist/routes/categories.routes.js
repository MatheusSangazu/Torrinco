import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
const router = Router();
router.use(authenticateJwt);
router.get('/', CategoriesController.list);
router.post('/', CategoriesController.create);
router.put('/:id', CategoriesController.update);
router.delete('/:id', CategoriesController.delete);
export default router;
//# sourceMappingURL=categories.routes.js.map