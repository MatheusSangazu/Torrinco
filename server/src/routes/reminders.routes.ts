import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { reminderSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

router.use(authenticateJwt);

router.post('/', validate({ body: reminderSchemas.create }), ReminderController.create);
router.get('/', validate({ query: reminderSchemas.listQuery }), ReminderController.list);
router.get('/due', validate({ query: reminderSchemas.dueQuery }), ReminderController.listDue);
router.get('/:id', validate({ params: commonSchemas.idParams }), ReminderController.getById);
router.put('/:id', validate({ params: commonSchemas.idParams, body: reminderSchemas.update }), ReminderController.update);
router.delete('/:id', validate({ params: commonSchemas.idParams }), ReminderController.delete);

router.post('/logs', validate({ body: reminderSchemas.createLog }), ReminderController.createLog);
router.get('/logs', validate({ query: reminderSchemas.listQuery }), ReminderController.listLogs);

export default router;
