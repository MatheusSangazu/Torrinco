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
  static async listAccounts(query:any) {
    const where:any={};
    if(query.status) where.status=query.status;
    if(query.origin) where.origin=query.origin;
    if(query.plan) where.plans={name:query.plan};
    if(query.from||query.to) where.created_at={...(query.from&&{gte:new Date(query.from)}),...(query.to&&{lte:new Date(query.to)})};
    if(query.search){const id=Number(query.search);where.OR=[...(Number.isInteger(id)?[{id}]:[]),{name:{contains:query.search}},{users:{some:{OR:[{email:{contains:query.search}},{phone_number:{contains:query.search.replace(/\D/g,'')}}]}}}]}
    const rows=await prisma.accounts.findMany({where,include:{plans:true,users:{select:{id:true,name:true,email:true,phone_number:true,role:true,status:true}}},orderBy:{created_at:'desc'},take:100});
    return rows.map(a=>({...a,users:a.users.map(u=>({...u,phone_number:maskPhone(u.phone_number)}))}));
  }
  static account(id:number){return prisma.accounts.findUnique({where:{id},include:{plans:true,users:{select:{id:true,name:true,email:true,phone_number:true,role:true,status:true,created_at:true}},subscription_history:{orderBy:{created_at:'desc'}},account_invitations:{orderBy:{created_at:'desc'},select:{id:true,status:true,purpose:true,expires_at:true,send_count:true,accepted_at:true,revoked_at:true,created_at:true}}}})}
  static async createTester(input:ProvisionAccountInput,ctx:AuditContext){try{const made=await AccountProvisioningService.provision(input);const link=`${process.env.PUBLIC_APP_URL??'http://localhost:5173'}/first-access?invite=${encodeURIComponent(made.plainToken)}`;const sent=await EvolutionService.sendText(made.user.phone_number,`Você foi convidado para testar o Torrinco. Crie sua senha em: ${link}`);await prisma.account_invitations.update({where:{id:made.invitation.id},data:{status:sent?'sent':'pending',send_count:{increment:1}}});await audit(ctx,'tester.create',{userId:made.user.id,accountId:made.account.id},input.note,'succeeded',{plan:input.planName,trialDays:input.trialDays});return {...made,plainToken:undefined};}catch(e){await audit(ctx,'tester.create',{},input.note,'failed');throw e}}
  static async resendInvite(id:number,ctx:AuditContext){const inv=await prisma.account_invitations.findUnique({where:{id},include:{users:true}});if(!inv||inv.status==='accepted'||inv.status==='revoked')throw Object.assign(new Error('Convite não reenviável'),{statusCode:409});if(inv.expires_at<=new Date()){await prisma.account_invitations.update({where:{id},data:{status:'expired'}});throw Object.assign(new Error('Convite expirado'),{statusCode:409});}const token=crypto.randomBytes(32).toString('base64url');const hash=crypto.createHash('sha256').update(token).digest('hex');const link=`${process.env.PUBLIC_APP_URL??'http://localhost:5173'}/first-access?invite=${encodeURIComponent(token)}`;const sent=await EvolutionService.sendText(inv.users.phone_number,`Seu convite Torrinco: ${link}`);const updated=await prisma.account_invitations.update({where:{id},data:{token_hash:hash,status:sent?'sent':'pending',send_count:{increment:1}}});await audit(ctx,'invite.resend',{userId:inv.user_id,accountId:inv.account_id},undefined,'succeeded');return updated}
  static async revokeInvite(id:number,ctx:AuditContext){const inv=await prisma.account_invitations.update({where:{id},data:{status:'revoked',revoked_at:new Date()}});await audit(ctx,'invite.revoke',{userId:inv.user_id,accountId:inv.account_id},undefined,'succeeded');return inv}
  static async changeAccount(id:number,data:any,ctx:AuditContext){const current=await prisma.accounts.findUnique({where:{id}});if(!current)throw Object.assign(new Error('Conta não encontrada'),{statusCode:404});if(id===ctx.actorUserId)throw Object.assign(new Error('Operação sobre o próprio owner bloqueada'),{statusCode:403});const plan=data.planName?await prisma.plans.findUnique({where:{name:data.planName}}):null;if(data.planName&&!plan)throw Object.assign(new Error('Plano inválido'),{statusCode:400});const update:any={};if(data.status)update.status=data.status;if(plan)update.plan_id=plan.id;if(data.trialDays)update.trial_ends_at=new Date((current.trial_ends_at?.getTime()??Date.now())+data.trialDays*86_400_000);if(data.temporaryDays){update.status='active';update.current_period_ends_at=new Date(Date.now()+data.temporaryDays*86_400_000)}const changed=await prisma.$transaction(async tx=>{const a=await tx.accounts.update({where:{id},data:update});await tx.subscription_history.create({data:{account_id:id,plan_id:a.plan_id,previous_status:current.status,new_status:a.status!,reason:data.reason,metadata:{actorUserId:ctx.actorUserId}}});return a});if(data.status==='suspended'){for(const user of await prisma.users.findMany({where:{account_id:id},select:{id:true}}))await RefreshTokenService.revokeAllUserTokens(user.id)}invalidateAccountStatusCache(id);await audit(ctx,'account.change',{accountId:id},data.reason,'succeeded',{changes:update});return changed}
  static async revokeSessions(userId:number,reason:string,ctx:AuditContext){if(userId===ctx.actorUserId)throw Object.assign(new Error('Não é permitido revogar a própria sessão'),{statusCode:403});await RefreshTokenService.revokeAllUserTokens(userId);const user=await prisma.users.findUnique({where:{id:userId}});await audit(ctx,'sessions.revoke',{userId,accountId:user?.account_id},reason,'succeeded')}
  static history(){return prisma.platform_admin_audit.findMany({orderBy:{created_at:'desc'},take:200,include:{actor:{select:{id:true,name:true}},target_user:{select:{id:true,name:true}}}})}
}
