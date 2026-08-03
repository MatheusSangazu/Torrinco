FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src

# prisma generate não conecta no banco — só valida o schema.
# Placeholder é sobrescrito em runtime pelo ENVIRONMENT do Coolify.
ENV DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder"

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 3001

ENV NODE_ENV=production

# Roda migrations (usa DATABASE_URL do environment do Coolify) e inicia o server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
