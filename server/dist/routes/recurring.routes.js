import { Router } from 'express';
import { RecurringController } from '../controllers/recurring.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
const router = Router();
// Todas as rotas de recorrência requerem autenticação JWT
router.use(authenticateJwt);
// Rotas RESTful para transações recorrentes
router.post('/', RecurringController.createTransaction);
router.get('/', RecurringController.listTransactions);
router.get('/due', RecurringController.listDue);
router.put('/:id', RecurringController.updateTransaction);
router.delete('/:id', RecurringController.deleteTransaction);
// Rota para gerar transação real a partir de uma recorrente
router.post('/:id/generate', RecurringController.generateTransaction);
export default router;
//# sourceMappingURL=recurring.routes.js.map