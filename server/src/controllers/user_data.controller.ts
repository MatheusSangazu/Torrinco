import type { Response,NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import { RefreshTokenService } from '../services/refresh-token.service.js';
import { clearRefreshTokenCookie } from '../lib/cookie.js';
import { disconnectGoogle } from '../services/google/auth.service.js';
import { deletionGraceDays, privacyAudit, retentionPolicy } from '../services/privacy.service.js';

function jsonSafe<T>(value:T):T {
  return JSON.parse(JSON.stringify(value,(_key,item)=>typeof item==='bigint'?item.toString():item));
}

export async function completeDeletion(requestId:bigint,userId:number,accountId:number){
  const google=await disconnectGoogle(userId);
  await RefreshTokenService.revokeAllUserTokens(userId);
  await prisma.$transaction([
    prisma.users.update({where:{id:userId},data:{name:'conta_anonimizada',phone_number:`deleted-${userId}-${Date.now()}`,email:null,password_hash:null,status:'inactive'}}),
    prisma.accounts.update({where:{id:accountId},data:{status:'cancelled',cancelled_at:new Date()}}),
    prisma.data_subject_requests.update({where:{id:requestId},data:{status:'completed',completed_at:new Date(),result:{identityAnonymized:true,sessionsRevoked:true,googleLocalCredentialsRemoved:true,googleRemoteRevocationConfirmed:google.revoked,retention:retentionPolicy()} as any}})
  ]);
  await privacyAudit({userId,accountId,eventType:'privacy.deletion.complete',targetType:'data_subject_request',targetId:String(requestId),outcome:'succeeded'});
}

export class UserDataController {
  static async export(req:JwtRequest,res:Response,next:NextFunction){try{
    const userId=req.userId!,accountId=req.accountId!;
    const [user,account,entities,transactions,cardBills,recurring,purchases,categories,reminders,reminderLogs,events,recurringEvents,budgets,incomeSources,consents,requests,subscriptionHistory,auditEvents]=await Promise.all([
      prisma.users.findUnique({where:{id:userId},select:{id:true,name:true,email:true,phone_number:true,role:true,status:true,google_email:true,google_calendar_id:true,created_at:true,account_id:true}}),
      prisma.accounts.findUnique({where:{id:accountId}}),prisma.financial_entities.findMany({where:{account_id:accountId}}),
      prisma.transactions.findMany({where:{user_id:userId},orderBy:{transaction_date:'desc'}}),prisma.card_bills.findMany({where:{user_id:userId}}),
      prisma.recurring_transactions.findMany({where:{user_id:userId}}),prisma.purchase_installments.findMany({where:{user_id:userId}}),
      prisma.categories.findMany({where:{account_id:accountId}}),prisma.reminders.findMany({where:{user_id:userId}}),prisma.reminder_logs.findMany({where:{user_id:userId}}),
      prisma.events.findMany({where:{user_id:userId}}),prisma.recurring_events.findMany({where:{user_id:userId}}),prisma.budgets.findMany({where:{user_id:userId}}),
      prisma.income_sources.findMany({where:{user_id:userId}}),prisma.legal_consents.findMany({where:{user_id:userId}}),prisma.data_subject_requests.findMany({where:{user_id:userId}}),
      prisma.subscription_history.findMany({where:{account_id:accountId}}),prisma.privacy_audit_events.findMany({where:{user_id:userId}})
    ]);
    await privacyAudit({userId,accountId,eventType:'privacy.export',targetType:'user',targetId:userId,outcome:'succeeded'});
    res.setHeader('Content-Disposition',`attachment; filename="torrinco-dados-${userId}-${Date.now()}.json"`);
    res.json(jsonSafe({exported_at:new Date().toISOString(),format:'torrinco_personal_data_v2',scope_note:'Inclui dados pessoais e registros vinculados ao usuário; segredos de autenticação e tokens não são exportados.',user,account,entities,transactions,card_bills:cardBills,recurring_transactions:recurring,purchase_installments:purchases,categories,reminders,reminder_logs:reminderLogs,events,recurring_events:recurringEvents,budgets,income_sources:incomeSources,legal_consents:consents,data_subject_requests:requests,subscription_history:subscriptionHistory,privacy_audit_events:auditEvents}));
  }catch(error){next(error)}}

  static async requestDeletion(req:JwtRequest,res:Response,next:NextFunction){try{
    const userId=req.userId!,accountId=req.accountId!;const existing=await prisma.data_subject_requests.findFirst({where:{user_id:userId,request_type:'deletion',status:{in:['requested','processing']}}});
    if(existing)return res.status(409).json({error:'Já existe uma solicitação de exclusão em andamento',request:existing});
    const days=deletionGraceDays();const due=new Date(Date.now()+days*86_400_000);
    const request=await prisma.data_subject_requests.create({data:{user_id:userId,account_id:accountId,request_type:'deletion',status:days===0?'processing':'requested',due_at:due}});
    await privacyAudit({userId,accountId,eventType:'privacy.deletion.request',targetType:'data_subject_request',targetId:String(request.id),outcome:'requested',metadata:{configuredGraceDays:days}});
    if(days===0){await completeDeletion(request.id,userId,accountId);clearRefreshTokenCookie(res);return res.status(202).json({requestId:String(request.id),status:'completed',dueAt:due,retention:retentionPolicy()})}
    res.status(202).json({requestId:String(request.id),status:request.status,dueAt:request.due_at});
  }catch(error){next(error)}}

  static async listRequests(req:JwtRequest,res:Response,next:NextFunction){try{const requests=await prisma.data_subject_requests.findMany({where:{user_id:req.userId!},orderBy:{requested_at:'desc'}});res.json({requests:requests.map(r=>({...r,id:String(r.id)}))})}catch(error){next(error)}}
}
