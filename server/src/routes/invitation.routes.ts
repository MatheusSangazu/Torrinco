import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { InvitationController } from '../controllers/invitation.controller.js';
const router=Router();
router.post('/accept',rateLimit({windowMs:60*60_000,max:10,standardHeaders:true,legacyHeaders:false}),validate({body:z.object({token:z.string().min(32).max(200),password:z.string().min(8).max(100).regex(/[A-Za-z]/).regex(/\d/),accept_terms:z.literal(true),accept_privacy:z.literal(true)}).strict()}),InvitationController.accept);
export default router;
