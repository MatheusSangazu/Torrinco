import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { budgetSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

router.use(authenticateJwt);

router.post('/', validate({ body: budgetSchemas.upsert }), BudgetController.upsert);
router.get('/', validate({ query: budgetSchemas.listQuery }), BudgetController.list);
router.delete('/:id', validate({ params: commonSchemas.idParams }), BudgetController.delete);

export default router;
