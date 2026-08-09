import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const raw = process.argv[2] ?? process.env.PLATFORM_OWNER_USER_ID;
  const action = process.argv[3] ?? process.env.PLATFORM_OWNER_ACTION ?? 'promote';
  const userId = Number(raw);
  if (!Number.isInteger(userId) || userId <= 0) throw new Error('Informe um user ID positivo por argumento ou PLATFORM_OWNER_USER_ID');
  if (!['promote','remove'].includes(action)) throw new Error('Ação deve ser promote ou remove');
  const user = await prisma.users.findUnique({ where: { id: userId }, select: { id:true, account_id:true } });
  if (!user) throw new Error(`Usuário ${userId} não existe; nenhuma alteração foi feita`);
  if (action === 'promote') {
    await prisma.platform_user_roles.upsert({ where:{user_id_role:{user_id:userId,role:'platform_owner'}},create:{user_id:userId,role:'platform_owner'},update:{revoked_at:null} });
  } else {
    const activeOwners=await prisma.platform_user_roles.count({where:{role:'platform_owner',revoked_at:null}});
    if(activeOwners<=1)throw new Error('Não é permitido remover o último platform_owner');
    await prisma.platform_user_roles.updateMany({where:{user_id:userId,role:'platform_owner',revoked_at:null},data:{revoked_at:new Date()}});
  }
  await prisma.platform_admin_audit.create({data:{actor_user_id:userId,target_user_id:userId,target_account_id:user.account_id,action:`platform_owner.${action}`,reason:'secure_cli',outcome:'succeeded',metadata:{source:'scripts/platform-owner.ts'}}});
  console.log(`Operação ${action} concluída de forma idempotente para user_id=${userId}`);
}
main().catch(error=>{console.error(error instanceof Error?error.message:'Falha segura');process.exitCode=1}).finally(()=>prisma.$disconnect());
