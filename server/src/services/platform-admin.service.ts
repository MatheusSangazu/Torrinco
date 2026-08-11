import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { maskPhone } from '../lib/mask.js';
import { hashIp } from './privacy.service.js';
import { EvolutionService } from './evolution.service.js';
import { RefreshTokenService } from './refresh-token.service.js';
import { invalidateAccountStatusCache } from '../middleware/jwt.js';
import { AccountProvisioningService, type ProvisionAccountInput } from './account-provisioning.service.js';

export type AuditContext = { actorUserId:number; ip?:string; userAgent?:string };
async function audit(ctx:AuditContext, action:string, target:{userId?:number;accountId?:number}, reason:string|undefined, outcome:string, metadata?:object) {
  return prisma.platform_admin_audit.create({ data: { actor_user_id:ctx.actorUserId,target_user_id:target.userId,target_account_id:target.accountId,action,reason,outcome,ip_hash:hashIp(ctx.ip),user_agent:ctx.userAgent?.slice(0,255),metadata:metadata as any } });
}

export class PlatformAdminService {
  static async dashboard() {
    const now = new Date();
    const [accounts,users,trialsActive,trialsExpired,statuses] = await Promise.all([
      prisma.accounts.count(), prisma.users.count(), prisma.accounts.count({where:{status:'trial',trial_ends_at:{gt:now}}}),
      prisma.accounts.count({where:{OR:[{status:'expired'},{status:'trial',trial_ends_at:{lte:now}}]}}),
      prisma.accounts.groupBy({by:['status'],_count:{_all:true}}),
    ]);
    return {accounts,users,trials:{active:trialsActive,expired:trialsExpired},statuses:Object.fromEntries(statuses.map(x=>[x.status??'unknown',x._count._all]))};
  }
  static plans(){return prisma.plans.findMany({where:{status:'active'},select:{id:true,name:true,max_users:true},orderBy:{id:'asc'}})}
  static async listAccounts(query:any) {
    const page=Number(query.page)||1;
    const pageSize=Number(query.pageSize)||25;
    const sort=query.sort??'created_at';
    const direction=query.direction??'desc';
    const where:any={};
    if(query.status) where.status=query.status;
    if(query.accessStatus) where.access_status=query.accessStatus;
    if(query.origin) where.origin=query.origin;
    if(query.plan) where.plans={name:query.plan};
    if(query.trial){const now=new Date();if(query.trial==='active')where.AND=[...(where.AND??[]),{status:'trial',trial_ends_at:{gt:now}}];else if(query.trial==='expiring')where.AND=[...(where.AND??[]),{status:'trial',trial_ends_at:{gt:now,lte:new Date(now.getTime()+7*86_400_000)}}];else where.AND=[...(where.AND??[]),{OR:[{status:'expired'},{status:'trial',trial_ends_at:{lte:now}}]}]}
    if(query.from||query.to) where.created_at={...(query.from&&{gte:new Date(query.from)}),...(query.to&&{lte:new Date(query.to)})};
    if(query.search){const id=Number(query.search);where.OR=[...(Number.isInteger(id)?[{id}]:[]),{name:{contains:query.search}},{users:{some:{OR:[{email:{contains:query.search}},{phone_number:{contains:query.search.replace(/\D/g,'')}}]}}}]}
    const orderBy=sort==='activity'?{transactions:{_count:direction}}:{[sort]:direction};
    const [total,rows]=await Promise.all([prisma.accounts.count({where}),prisma.accounts.findMany({where,include:{plans:true,users:{select:{id:true,name:true,email:true,phone_number:true,role:true,status:true}},_count:{select:{transactions:true}}},orderBy,skip:(page-1)*pageSize,take:pageSize})]);
    return {accounts:rows.map(a=>({...a,users:a.users.map(u=>({...u,phone_number:maskPhone(u.phone_number)}))})),pagination:{page,page_size:pageSize,total,total_pages:Math.ceil(total/pageSize)}};
  }
  static account(id:number){return prisma.accounts.findUnique({where:{id},include:{plans:true,users:{select:{id:true,name:true,email:true,phone_number:true,role:true,status:true,created_at:true}},subscription_history:{orderBy:{created_at:'desc'}},account_invitations:{orderBy:{created_at:'desc'},select:{id:true,status:true,purpose:true,expires_at:true,send_count:true,accepted_at:true,revoked_at:true,created_at:true}}}})}
  static async createTester(input:ProvisionAccountInput,ctx:AuditContext){try{const made=await AccountProvisioningService.provision(input);const link=`${process.env.PUBLIC_APP_URL??'http://localhost:5173'}/first-access?invite=${encodeURIComponent(made.plainToken)}`;let delivery:'sent'|'pending'|'failed'='pending';try{delivery=await EvolutionService.sendText(made.user.phone_number,`Você foi convidado para testar o Torrinco. Crie sua senha em: ${link}`)?'sent':'pending'}catch{delivery='failed'}const invitation=await prisma.account_invitations.update({where:{id:made.invitation.id},data:{status:delivery==='sent'?'sent':'pending',send_count:{increment:1}}});await audit(ctx,'tester.create',{userId:made.user.id,accountId:made.account.id},input.note,'succeeded',{plan:input.planName,trialDays:input.trialDays,invitationDelivery:delivery});return {...made,invitation,invitation_delivery:delivery,plainToken:undefined};}catch(e){await audit(ctx,'tester.create',{},input.note,'failed');throw e}}
  static async resendInvite(id:number,ctx:AuditContext){const inv=await prisma.account_invitations.findUnique({where:{id},include:{users:true}});if(!inv||inv.status==='accepted'||inv.status==='revoked')throw Object.assign(new Error('Convite não reenviável'),{statusCode:409});if(inv.expires_at<=new Date()){await prisma.account_invitations.update({where:{id},data:{status:'expired'}});throw Object.assign(new Error('Convite expirado'),{statusCode:409});}const token=crypto.randomBytes(32).toString('base64url');const hash=crypto.createHash('sha256').update(token).digest('hex');const link=`${process.env.PUBLIC_APP_URL??'http://localhost:5173'}/first-access?invite=${encodeURIComponent(token)}`;const sent=await EvolutionService.sendText(inv.users.phone_number,`Seu convite Torrinco: ${link}`);const updated=await prisma.account_invitations.update({where:{id},data:{token_hash:hash,status:sent?'sent':'pending',send_count:{increment:1}}});await audit(ctx,'invite.resend',{userId:inv.user_id,accountId:inv.account_id},undefined,'succeeded');return updated}
  static async revokeInvite(id:number,ctx:AuditContext){const inv=await prisma.account_invitations.update({where:{id},data:{status:'revoked',revoked_at:new Date()}});await audit(ctx,'invite.revoke',{userId:inv.user_id,accountId:inv.account_id},undefined,'succeeded');return inv}
  static async changeAccount(id:number,data:any,ctx:AuditContext){
    const [current,actor]=await Promise.all([
      prisma.accounts.findUnique({where:{id}}),
      prisma.users.findUnique({where:{id:ctx.actorUserId},select:{account_id:true}}),
    ]);
    if(!current)throw Object.assign(new Error('Conta não encontrada'),{statusCode:404});
    if(actor?.account_id===id)throw Object.assign(new Error('Operação sobre a própria conta do owner bloqueada'),{statusCode:403});
    const plan=data.planName?await prisma.plans.findUnique({where:{name:data.planName}}):null;
    if(data.planName&&!plan)throw Object.assign(new Error('Plano inválido'),{statusCode:400});
    const update:any={};
    if(data.status)update.status=data.status;
    if(plan)update.plan_id=plan.id;
    if(data.trialDays)update.trial_ends_at=new Date((current.trial_ends_at?.getTime()??Date.now())+data.trialDays*86_400_000);
    if(data.temporaryDays){update.status='active';update.current_period_ends_at=new Date(Date.now()+data.temporaryDays*86_400_000)}
    if(data.accessStatus==='suspended'){
      update.access_status='suspended';update.access_suspended_at=new Date();update.access_suspension_reason=data.reason;update.access_suspended_by_user_id=ctx.actorUserId;
    }else if(data.accessStatus==='enabled'){
      update.access_status='enabled';update.access_suspended_at=null;update.access_suspension_reason=null;update.access_suspended_by_user_id=null;
    }
    const commercialChanged=update.status!==undefined||update.plan_id!==undefined||update.trial_ends_at!==undefined||update.current_period_ends_at!==undefined;
    const changed=await prisma.$transaction(async tx=>{
      const account=await tx.accounts.update({where:{id},data:update});
      if(commercialChanged)await tx.subscription_history.create({data:{account_id:id,plan_id:account.plan_id,previous_status:current.status,new_status:account.status!,reason:data.reason,metadata:{actorUserId:ctx.actorUserId}}});
      return account;
    });
    if(data.accessStatus==='suspended')for(const user of await prisma.users.findMany({where:{account_id:id},select:{id:true}}))await RefreshTokenService.revokeAllUserTokens(user.id);
    invalidateAccountStatusCache(id);
    const action=data.accessStatus==='suspended'?'account.access.suspend':data.accessStatus==='enabled'?'account.access.enable':'account.commercial.change';
    await audit(ctx,action,{accountId:id},data.reason,'succeeded',{before:{status:current.status,accessStatus:current.access_status},after:{status:changed.status,accessStatus:changed.access_status},changes:update});
    return changed;
  }
  static async revokeSessions(userId:number,reason:string,ctx:AuditContext){if(userId===ctx.actorUserId)throw Object.assign(new Error('Não é permitido revogar a própria sessão'),{statusCode:403});await RefreshTokenService.revokeAllUserTokens(userId);const user=await prisma.users.findUnique({where:{id:userId}});await audit(ctx,'sessions.revoke',{userId,accountId:user?.account_id},reason,'succeeded')}
  static async history(query:any={}){
    const page=Number(query.page)||1;const pageSize=Number(query.pageSize)||20;const where:any={};
    if(query.accountId)where.target_account_id=query.accountId;
    if(query.action)where.action=query.action;
    if(query.outcome)where.outcome=query.outcome;
    if(query.from||query.to)where.created_at={...(query.from&&{gte:new Date(query.from)}),...(query.to&&{lte:new Date(query.to)})};
    const select={id:true,actor_user_id:true,target_user_id:true,target_account_id:true,action:true,reason:true,outcome:true,created_at:true,actor:{select:{id:true,name:true}},target_user:{select:{id:true,name:true}},target_account:{select:{id:true,name:true}}};
    const [total,actions]=await Promise.all([prisma.platform_admin_audit.count({where}),prisma.platform_admin_audit.findMany({where,select,orderBy:[{created_at:'desc'},{id:'desc'}],skip:(page-1)*pageSize,take:pageSize})]);
    return {actions:actions.map(item=>({...item,id:item.id.toString()})),pagination:{page,page_size:pageSize,total,total_pages:Math.ceil(total/pageSize)}};
  }
}
