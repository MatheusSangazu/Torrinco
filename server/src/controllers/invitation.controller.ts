import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import type { Request,Response,NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { getValidatedBody } from '../middleware/validate.js';
import { recordCurrentConsents } from '../services/privacy.service.js';

export class InvitationController {
  static async accept(req:Request,res:Response,next:NextFunction){try{
    const {token,password,accept_terms,accept_privacy}=getValidatedBody<any>(req);
    const token_hash=crypto.createHash('sha256').update(token).digest('hex');
    const invitation=await prisma.account_invitations.findUnique({where:{token_hash},include:{users:true}});
    if(!invitation||invitation.status==='revoked')return res.status(400).json({error:'Convite inválido ou revogado'});
    if(invitation.status==='accepted')return res.status(409).json({error:'Convite já aceito'});
    if(invitation.expires_at<=new Date()){await prisma.account_invitations.update({where:{id:invitation.id},data:{status:'expired'}});return res.status(400).json({error:'Convite expirado'});}
    if(!accept_terms||!accept_privacy)return res.status(400).json({error:'Aceite dos documentos é obrigatório'});
    const password_hash=await bcrypt.hash(password,10);
    await prisma.$transaction(async tx=>{await tx.users.update({where:{id:invitation.user_id},data:{password_hash}});await tx.account_invitations.update({where:{id:invitation.id},data:{status:'accepted',accepted_at:new Date()}})});
    await recordCurrentConsents({userId:invitation.user_id,accountId:invitation.account_id,origin:'admin_invite',ip:req.ip,userAgent:req.get('user-agent'),evidence:{invitationId:invitation.id}});
    res.json({ok:true});
  }catch(e){next(e)}}
}
