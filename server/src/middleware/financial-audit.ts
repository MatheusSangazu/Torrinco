import type { Response,NextFunction } from 'express';
import type { JwtRequest } from './jwt.js';
import { privacyAudit } from '../services/privacy.service.js';
export function auditFinancialMutation(req:JwtRequest,res:Response,next:NextFunction){
  if(!['POST','PUT','PATCH','DELETE'].includes(req.method))return next();
  const started=Date.now();
  res.on('finish',()=>{privacyAudit({userId:req.userId,accountId:req.accountId,eventType:`financial.${req.method.toLowerCase()}`,targetType:'route',targetId:req.route?.path??req.path,outcome:res.statusCode<400?'succeeded':'failed',metadata:{statusCode:res.statusCode,durationMs:Date.now()-started}}).catch(err=>console.error('[financial-audit] persist failed',err))});
  next();
}
