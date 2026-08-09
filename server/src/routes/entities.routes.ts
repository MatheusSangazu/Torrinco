import { Router } from 'express';
import { EntityController } from '../controllers/entity.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { entitySchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

router.use(authenticateJwt);

router.post('/', validate({ body: entitySchemas.create }), EntityController.create);
router.get('/', validate({ query: entitySchemas.listQuery }), EntityController.list);
router.get('/:id', validate({ params: commonSchemas.idParams }), EntityController.getById);
router.put('/:id', validate({ params: commonSchemas.idParams, body: entitySchemas.update }), EntityController.update);
router.delete('/:id', validate({ params: commonSchemas.idParams }), EntityController.delete);

export default router;
