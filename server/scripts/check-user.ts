import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const u = await prisma.users.findUnique({
    where: { phone_number: '5579981003085' },
    select: { id: true, name: true, phone_number: true, password_hash: true, status: true }
  });
  console.log(JSON.stringify(u, null, 2));
}
main().finally(() => prisma.$disconnect());
