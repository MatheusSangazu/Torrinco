import type { Response, NextFunction } from 'express';
import type { PlatformRequest } from '../middleware/platform-admin.js';
import { getValidatedBody, getValidatedParams, getValidatedQuery } from '../middleware/validate.js';
import { PlatformAdminService } from '../services/platform-admin.service.js';

const context=(req:PlatformRequest)=>({actorUserId:req.userId!,ip:req.ip,userAgent:req.get('user-agent')});
export class PlatformAdminController {
  static async dashboard(_req:PlatformRequest,res:Response,next:NextFunction){try{res.json(await PlatformAdminService.dashboard())}catch(e){next(e)}}
  static async accounts(req:PlatformRequest,res:Response,next:NextFunction){try{res.json({accounts:await PlatformAdminService.listAccounts(getValidatedQuery(req))})}catch(e){next(e)}}
  static async account(req:PlatformRequest,res:Response,next:NextFunction){try{const {id}=getValidatedParams<{id:number}>(req);const account=await PlatformAdminService.account(id);if(!account)return res.status(404).json({error:'Conta não encontrada'});res.json({account:{...account,users:account.users.map(u=>({...u,phone_number:u.phone_number.replace(/.(?=.{2})/g,'*')}))}})}catch(e){next(e)}}
  static async tester(req:PlatformRequest,res:Response,next:NextFunction){try{const body=getValidatedBody<any>(req);const result=await PlatformAdminService.createTester({name:body.name,phone:body.phone_number,email:body.email,trialDays:body.trial_days,planName:body.plan,origin:'platform_tester',createdBy:req.userId!,note:body.note},context(req));res.status(201).json(result)}catch(e){next(e)}}
  static async resend(req:PlatformRequest,res:Response,next:NextFunction){try{const {id}=getValidatedParams<{id:number}>(req);res.json({invitation:await PlatformAdminService.resendInvite(id,context(req))})}catch(e){next(e)}}
  static async revoke(req:PlatformRequest,res:Response,next:NextFunction){try{const {id}=getValidatedParams<{id:number}>(req);res.json({invitation:await PlatformAdminService.revokeInvite(id,context(req))})}catch(e){next(e)}}
  static async change(req:PlatformRequest,res:Response,next:NextFunction){try{const {id}=getValidatedParams<{id:number}>(req);if(id===req.accountId)return res.status(403).json({error:'Alteração da própria conta do platform_owner bloqueada'});res.json({account:await PlatformAdminService.changeAccount(id,getValidatedBody(req),context(req))})}catch(e){next(e)}}
  static async revokeSessions(req:PlatformRequest,res:Response,next:NextFunction){try{const {id}=getValidatedParams<{id:number}>(req);const {reason}=getValidatedBody<{reason:string}>(req);await PlatformAdminService.revokeSessions(id,reason,context(req));res.json({ok:true})}catch(e){next(e)}}
  static async history(_req:PlatformRequest,res:Response,next:NextFunction){try{res.json({actions:await PlatformAdminService.history()})}catch(e){next(e)}}
}
