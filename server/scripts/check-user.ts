import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  // Substitua pelo telefone que deseja inspecionar (fixture de exemplo).
  const targetPhone = process.argv[2] ?? '5511999990001';
  const u = await prisma.users.findUnique({
    where: { phone_number: targetPhone },
    select: { id: true, name: true, phone_number: true, password_hash: true, status: true }
  });
  console.log(JSON.stringify(u, null, 2));
}
main().finally(() => prisma.$disconnect());
