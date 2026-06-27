import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const users = await prisma.users.findMany({
  select: { id: true, name: true, phone_number: true, status: true, accounts: { select: { status: true } } }
});
console.log(JSON.stringify(users, null, 2));
await prisma.$disconnect();
