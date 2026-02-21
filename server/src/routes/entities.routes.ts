import { Router } from 'express';
import { EntityController } from '../controllers/entity.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

// Todas as rotas de entidades requerem autenticação
router.use(authenticateJwt);

router.post('/', EntityController.create);
router.get('/', EntityController.list);
router.get('/:id', EntityController.getById);
router.put('/:id', EntityController.update);
router.delete('/:id', EntityController.delete);

export default router;