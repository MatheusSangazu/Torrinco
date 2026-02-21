import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

// Todas as rotas de orçamentos requerem autenticação
router.use(authenticateJwt);

router.post('/', BudgetController.upsert);
router.get('/', BudgetController.list);
router.delete('/:id', BudgetController.delete);

export default router;