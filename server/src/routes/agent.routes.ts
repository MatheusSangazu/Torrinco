import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller.js';
import { agentAuth } from '../middleware/agentAuth.js';
import { validate } from '../middleware/validate.js';
import { agentSchemas } from '../schemas/index.js';

const router = Router();

router.use(agentAuth);

// Registrar
router.post('/expense', validate({ body: agentSchemas.expense }), AgentController.expense);
router.post('/income', validate({ body: agentSchemas.income }), AgentController.income);

// Consultar
router.get('/balance', AgentController.balance);
router.get('/forecast', AgentController.forecast);
router.get('/upcoming', AgentController.upcoming);
router.get('/cards/bill', validate({ query: agentSchemas.cardNameQuery }), AgentController.cardBill);
router.get('/cards/history', validate({ query: agentSchemas.cardNameQuery }), AgentController.cardHistory);

// Ações
router.post('/cards/pay', validate({ body: agentSchemas.payBill }), AgentController.payBill);
router.post('/cards/undo', validate({ body: agentSchemas.undoBill }), AgentController.undoBill);
router.post('/refresh', AgentController.refresh);

export default router;
