import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

// Todas as rotas de finance requerem autenticação
router.use(authenticateJwt);

router.get('/summary', FinanceController.getSummary);
router.get('/forecast', FinanceController.getForecast);
router.post('/transactions', FinanceController.create);
router.get('/transactions', FinanceController.list);
router.get('/transactions/:id', FinanceController.getById);
router.put('/transactions/:id', FinanceController.update);
router.delete('/transactions/:id', FinanceController.delete);
router.get('/cards/:cardId/bill', FinanceController.getCardBill);
router.get('/cards/:cardId/next-bill', FinanceController.getCardNextBill);

export default router;