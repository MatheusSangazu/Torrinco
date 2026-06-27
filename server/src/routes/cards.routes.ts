import { Router } from 'express';
import { CardsController } from '../controllers/cards.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';

const router = Router();

router.use(authenticateJwt);

// Cartões
router.get('/', CardsController.list);
router.post('/', CardsController.create);
router.put('/:id', CardsController.update);
router.delete('/:id', CardsController.delete);

// Faturas (via billing.service — fonte única)
router.get('/:id/bill', CardsController.getCurrentBill);                          // fatura atual
router.get('/:id/bills', CardsController.getBillHistory);                         // histórico
router.get('/:id/bills/:billId', CardsController.getBillDetails);                 // detalhe por id
router.post('/:id/bills/:billId/pay', CardsController.payBill);                   // registrar pagamento
router.post('/:id/bills/:billId/undo', CardsController.undoBillPayment);          // desfazer pagamento

export default router;
