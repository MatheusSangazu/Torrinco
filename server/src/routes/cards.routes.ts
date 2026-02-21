import { Router } from 'express';
import { CardsController } from '../controllers/cards.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', CardsController.list);
router.get('/:id/bills', CardsController.getBillHistory);
router.post('/', CardsController.create);
router.put('/:id', CardsController.update);
router.delete('/:id', CardsController.delete);

export default router;
