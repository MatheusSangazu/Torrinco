import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { financeSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

// Todas as rotas de finance requerem autenticação
router.use(authenticateJwt);

router.get('/summary', validate({ query: financeSchemas.summaryQuery }), FinanceController.getSummary);
router.get('/forecast', validate({ query: financeSchemas.forecastQuery }), FinanceController.getForecast);
router.post('/transactions', validate({ body: financeSchemas.create }), FinanceController.create);
router.get('/transactions', validate({ query: financeSchemas.summaryQuery }), FinanceController.list);
router.get('/transactions/:id', validate({ params: commonSchemas.idParams }), FinanceController.getById);
router.put('/transactions/:id', validate({ params: commonSchemas.idParams, body: financeSchemas.update }), FinanceController.update);
router.delete('/transactions/:id', validate({ params: commonSchemas.idParams, query: financeSchemas.deleteQuery }), FinanceController.delete);
router.get('/cards/:cardId/bill', validate({ params: commonSchemas.cardIdParams }), FinanceController.getCardBill);
router.get('/cards/:cardId/next-bill', validate({ params: commonSchemas.cardIdParams }), FinanceController.getCardNextBill);
router.get('/cards/:cardId/previous-bill', validate({ params: commonSchemas.cardIdParams }), FinanceController.getCardPreviousBill);

export default router;
