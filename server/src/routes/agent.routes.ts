import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller.js';
import { agentAuth } from '../middleware/agentAuth.js';

/**
 * Camada agent-friendly.
 *
 * Auth dupla (agentAuth): JWT do app OU API key de serviço (x-api-key + x-user-id).
 * Endpoints de INTENÇÃO — o consumidor não precisa conhecer IDs, ciclos de fatura
 * nem categorias especiais. Cards/categorias são resolvidos por nome.
 */
const router = Router();

router.use(agentAuth);

// Registrar
router.post('/expense', AgentController.expense);   // flags: installments, recurring, card_name
router.post('/income', AgentController.income);     // flags: recurring

// Consultar
router.get('/balance', AgentController.balance);
router.get('/forecast', AgentController.forecast);
router.get('/upcoming', AgentController.upcoming);  // recorrências + faturas a vencer
router.get('/cards/bill', AgentController.cardBill);          // ?card_name=
router.get('/cards/history', AgentController.cardHistory);    // ?card_name=&months=

// Ações
router.post('/cards/pay', AgentController.payBill);          // body: card_name, payment_method?
router.post('/cards/undo', AgentController.undoBill);        // body: card_name
router.post('/refresh', AgentController.refresh);            // materializa recorrências vencidas

export default router;
