import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
const router = Router();
// Todas as rotas de lembretes requerem autenticação JWT
router.use(authenticateJwt);
// Rotas RESTful para lembretes
router.post('/', ReminderController.create);
router.get('/', ReminderController.list);
router.get('/due', ReminderController.listDue);
router.get('/:id', ReminderController.getById);
router.put('/:id', ReminderController.update);
router.delete('/:id', ReminderController.delete);
// Rotas para logs de lembretes
router.post('/logs', ReminderController.createLog);
router.get('/logs', ReminderController.listLogs);
export default router;
//# sourceMappingURL=reminders.routes.js.map