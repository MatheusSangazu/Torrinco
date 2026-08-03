FROM node:20-alpine AS builder

# Prisma precisa de openssl no Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# DATABASE_URL com fallback no prisma.config.ts (placeholder se não definida).
# Em runtime, o Coolify injeta o valor real via environment.
ENV DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder"

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 3001

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
