import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';

export const LEGAL_VERSIONS = { terms: '2026-08-09', privacy: '2026-08-09' } as const;
export type ConsentOrigin = 'pwa_first_access'|'whatsapp_onboarding'|'settings'|'admin_invite';

export function hashIp(ip?: string) {
  if (!ip) return null;
  const salt = process.env.PRIVACY_AUDIT_SALT ?? process.env.JWT_SECRET;
  if (!salt) return null;
  return crypto.createHmac('sha256', salt).update(ip).digest('hex');
}

export async function recordCurrentConsents(input:{userId:number;accountId:number;origin:ConsentOrigin;ip?:string;userAgent?:string;evidence?:object}) {
  const common = { user_id:input.userId, account_id:input.accountId, origin:input.origin, ip_hash:hashIp(input.ip), user_agent:input.userAgent?.slice(0,255), evidence:input.evidence as any };
  await prisma.$transaction([
    prisma.legal_consents.upsert({ where:{ user_id_document_type_document_version:{user_id:input.userId,document_type:'terms',document_version:LEGAL_VERSIONS.terms}}, update:{}, create:{...common,document_type:'terms',document_version:LEGAL_VERSIONS.terms} }),
    prisma.legal_consents.upsert({ where:{ user_id_document_type_document_version:{user_id:input.userId,document_type:'privacy',document_version:LEGAL_VERSIONS.privacy}}, update:{}, create:{...common,document_type:'privacy',document_version:LEGAL_VERSIONS.privacy} })
  ]);
}

export async function hasCurrentConsents(userId:number) {
  const count=await prisma.legal_consents.count({where:{user_id:userId,OR:[{document_type:'terms',document_version:LEGAL_VERSIONS.terms},{document_type:'privacy',document_version:LEGAL_VERSIONS.privacy}]}});
  return count===2;
}

export function deletionGraceDays(){const n=Number(process.env.PRIVACY_DELETION_GRACE_DAYS??0);return Number.isInteger(n)&&n>=0?n:0}
export function retentionPolicy(){
  const financial=process.env.PRIVACY_FINANCIAL_RETENTION_DAYS ? Number(process.env.PRIVACY_FINANCIAL_RETENTION_DAYS) : null;
  const audit=process.env.PRIVACY_AUDIT_RETENTION_DAYS ? Number(process.env.PRIVACY_AUDIT_RETENTION_DAYS) : null;
  return { financialDays:Number.isFinite(financial)?financial:null, auditDays:Number.isFinite(audit)?audit:null, legalReviewRequired:financial===null||audit===null };
}

export async function privacyAudit(event:{userId?:number;accountId?:number;eventType:string;targetType?:string;targetId?:string|number;outcome:'succeeded'|'failed'|'requested';metadata?:object}) {
  return prisma.privacy_audit_events.create({data:{user_id:event.userId,account_id:event.accountId,event_type:event.eventType,target_type:event.targetType,target_id:event.targetId==null?null:String(event.targetId),outcome:event.outcome,metadata:event.metadata as any}});
}
