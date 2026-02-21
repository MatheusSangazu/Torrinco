import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
const router = Router();
// Todas as rotas de calendário requerem autenticação
router.use(authenticateJwt);
// Rotas RESTful para eventos do calendário
router.post('/', CalendarController.create);
router.get('/', CalendarController.list);
router.get('/:id', CalendarController.getById);
router.put('/:id', CalendarController.update);
router.delete('/:id', CalendarController.delete);
export default router;
//# sourceMappingURL=calendar.routes.js.map