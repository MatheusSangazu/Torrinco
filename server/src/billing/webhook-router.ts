import { Router } from 'express';
import type { BillingProvider } from './types.js';
import { BillingOrchestratorService } from '../services/billing-orchestrator.service.js';

/** Ponto único onde o futuro gateway será conectado. Sempre recebe corpo bruto para validar a assinatura antes do JSON. */
export function createBillingWebhookRouter(provider:BillingProvider){
  const router=Router();
  router.post('/',async(req,res,next)=>{try{
    if(!Buffer.isBuffer(req.body))return res.status(400).json({error:'Raw webhook body required'});
    const result=await BillingOrchestratorService.processWebhook(provider,req.body,req.headers);
    res.status(200).json({received:true,duplicate:result.duplicate,review:'review' in result?result.review:false});
  }catch(error){next(error)}});
  return router;
}
