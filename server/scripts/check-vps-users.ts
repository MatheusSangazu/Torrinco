import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const users = await prisma.users.findMany({
    select: { id: true, name: true, phone_number: true, status: true }
  });
  console.log('Usuários no banco:', JSON.stringify(users, null, 2));
}
main().finally(() => prisma.$disconnect());
