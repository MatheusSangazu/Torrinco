import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller.js';
import { authenticateJwt } from '../middleware/jwt.js';
import { validate } from '../middleware/validate.js';
import { calendarSchemas, commonSchemas } from '../schemas/index.js';
import { requireFeature } from '../middleware/plan.js';

const router = Router();

router.use(authenticateJwt);
router.use(requireFeature('calendar'));

router.post('/', validate({ body: calendarSchemas.create }), CalendarController.create);
router.get('/', validate({ query: calendarSchemas.listQuery }), CalendarController.list);
router.get('/:id', validate({ params: commonSchemas.idParams }), CalendarController.getById);
router.put('/:id', validate({ params: commonSchemas.idParams, body: calendarSchemas.update }), CalendarController.update);
router.delete('/:id', validate({ params: commonSchemas.idParams }), CalendarController.delete);

export default router;
