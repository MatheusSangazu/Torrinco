import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { categorySchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', validate({ query: categorySchemas.listQuery }), CategoriesController.list);
router.post('/', validate({ body: categorySchemas.create }), CategoriesController.create);
router.put('/:id', validate({ params: commonSchemas.idParams, body: categorySchemas.update }), CategoriesController.update);
router.delete('/:id', validate({ params: commonSchemas.idParams }), CategoriesController.delete);

export default router;
