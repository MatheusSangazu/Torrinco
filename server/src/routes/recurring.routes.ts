import { Router } from 'express';
import { RecurringController } from '../controllers/recurring.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { recurringSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

// Todas as rotas de recorrência requerem autenticação JWT
router.use(authenticateJwt);

router.post('/', validate({ body: recurringSchemas.create }), RecurringController.createTransaction);
router.get('/', validate({ query: recurringSchemas.listQuery }), RecurringController.listTransactions);
router.get('/due', validate({ query: recurringSchemas.dueQuery }), RecurringController.listDue);
router.post('/run', RecurringController.runMaterialization);
router.put('/:id', validate({ params: commonSchemas.idParams, body: recurringSchemas.update }), RecurringController.updateTransaction);
router.delete('/:id', validate({ params: commonSchemas.idParams }), RecurringController.deleteTransaction);
router.post('/:id/generate', validate({ params: commonSchemas.idParams, body: recurringSchemas.generate }), RecurringController.generateTransaction);

export default router;
