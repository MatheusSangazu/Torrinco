import { prisma } from '../lib/prisma.js';
import { completeDeletion } from '../controllers/user_data.controller.js';
import { retentionPolicy, privacyAudit } from './privacy.service.js';
export async function runPrivacyRetentionJob(now=new Date()){
  const due=await prisma.data_subject_requests.findMany({where:{request_type:'deletion',status:'requested',due_at:{lte:now}},take:100});
  let completed=0;
  for(const request of due){try{await prisma.data_subject_requests.update({where:{id:request.id},data:{status:'processing'}});await completeDeletion(request.id,request.user_id,request.account_id);completed++}catch(error:any){await prisma.data_subject_requests.update({where:{id:request.id},data:{status:'failed',last_error:String(error?.message??error).slice(0,2000)}});await privacyAudit({userId:request.user_id,accountId:request.account_id,eventType:'privacy.deletion.complete',targetType:'data_subject_request',targetId:String(request.id),outcome:'failed'})}}
  const policy=retentionPolicy();let anonymizedTransactions=0,deletedAuditEvents=0;
  if(policy.financialDays!==null){const cutoff=new Date(now.getTime()-policy.financialDays*86_400_000);const result=await prisma.transactions.updateMany({where:{accounts:{status:'cancelled',cancelled_at:{lte:cutoff}}},data:{description:null}});anonymizedTransactions=result.count}
  if(policy.auditDays!==null){const cutoff=new Date(now.getTime()-policy.auditDays*86_400_000);const result=await prisma.privacy_audit_events.deleteMany({where:{created_at:{lt:cutoff}}});deletedAuditEvents=result.count}
  return{completedDeletionRequests:completed,anonymizedTransactions,deletedAuditEvents,policy};
}
