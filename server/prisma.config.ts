import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // No Docker build, DATABASE_URL vem do ENVIRONMENT (Coolify).
    // Placeholder garante que o prisma generate funcione mesmo sem .env.
    url: process.env.DATABASE_URL ?? 'mysql://placeholder:placeholder@localhost:3306/placeholder',
  },
})
