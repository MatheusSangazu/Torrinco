import { Router } from 'express';
import { CardsController } from '../controllers/cards.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { cardSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

router.use(authenticateJwt);

// Cartões
router.get('/', CardsController.list);
router.post('/', validate({ body: cardSchemas.create }), CardsController.create);
router.put('/:id', validate({ params: commonSchemas.idParams, body: cardSchemas.update }), CardsController.update);
router.delete('/:id', validate({ params: commonSchemas.idParams }), CardsController.delete);

// Faturas (via billing.service — fonte única)
router.get('/:id/bill', validate({ params: commonSchemas.idParams }), CardsController.getCurrentBill);
router.get('/:id/bills', validate({ params: commonSchemas.idParams, query: cardSchemas.billHistoryQuery }), CardsController.getBillHistory);
router.get('/:id/bills/:billId', validate({ params: commonSchemas.dualIdParams }), CardsController.getBillDetails);
router.post('/:id/bills/:billId/pay', validate({ params: commonSchemas.dualIdParams, body: cardSchemas.payBill }), CardsController.payBill);
router.post('/:id/bills/:billId/undo', validate({ params: commonSchemas.dualIdParams }), CardsController.undoBillPayment);

export default router;
